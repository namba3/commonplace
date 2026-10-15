# 第3部：Traitと関連型による抽象化

作成日：2026-10-15 / 更新日：2026-10-15

[← シリーズ目次](./)

## 8. Trait・Associated Type・Generics：振る舞いと型の関係を抽象化する

所有権と借用がRustの安全性を特徴づけるなら、**TraitはRustの抽象化能力を特徴づける中核**だ。Traitを「JavaやC#のインターフェイスに似たもの」と説明することはできる。しかし、それだけではRustのTraitが持つ射程を見落とす。

Traitはメソッドの集合だけではない。メソッド（関連関数）、**Associated Type（関連型）**、Associated Constant（関連定数）をまとめて定義し、これらをGenerics、型推論、所有権、演算子、Iteratorなどと結び付けるための仕組みでもある。

### 8.1 Traitは「この型にどんな操作ができるか」を表現する

```rust
trait Area {
    fn area(&self) -> f64;
}

struct Rectangle {
    width: f64,
    height: f64,
}

impl Area for Rectangle {
    fn area(&self) -> f64 {
        self.width * self.height
    }
}

fn print_area(shape: &impl Area) {
    println!("{}", shape.area());
}
```

`Area`が要求するのは`area()`という振る舞いであり、`Rectangle`がどのクラスを継承しているかではない。`&impl Area`は、**具体的な型は呼び出し側で決まるが、少なくとも`Area`を実装している**という契約を表す。

RustのTraitは、C++のConcepts、Haskellの型クラス、Java/C#のインターフェイスと共通する側面を持つ。ただし、完全に同じものではない。特にRustは、**継承を中心にオブジェクトの階層を組み立てず、型と振る舞いを別々に宣言できる**構成を重視する。ただし他クレートの型・Traitへ任意に実装を追加できるわけではなく、第8.8節のOrphan Ruleが制約を設ける。

Traitにはデフォルト実装も持たせられる。Traitを実装する型に最低限の操作を要求し、それを使って便利な操作を組み立てられる。標準の`Iterator`はその代表例だ。

### 8.2 Associated Type：実装する型に結び付いた「型そのもの」

最初に、**標準ライブラリの`Iterator`とは別物**の、小さな自作Traitを考える。名前を`SimpleIterator`にして、後で使う標準Traitと区別する。

```rust
// 仕組みを示すための独立した定義
trait SimpleIterator {
    type Item;
    fn next(&mut self) -> Option<Self::Item>;
}
```

実際の標準Traitである`std::iter::Iterator`も`type Item;`を持ち、より多くのメソッドを提供する。

ここで`Item`は変数でもフィールドでもない。**Traitの実装に結び付いて決まる型**である。`Self::Item`は「このTrait実装が返す値の型」を意味する。

次は上の`SimpleIterator`とは独立したコード例で、**標準ライブラリの`Iterator`**を実装する。

```rust
struct Counter(u32);

impl std::iter::Iterator for Counter {
    type Item = u32;

    fn next(&mut self) -> Option<Self::Item> {
        if self.0 < 3 {
            let value = self.0;
            self.0 += 1;
            Some(value)
        } else {
            None
        }
    }
}

fn main() {
    let values: Vec<_> = Counter(0).collect();
    assert_eq!(values, vec![0, 1, 2]);
}
```

`Counter`は`Iterator`の実装内で`Item = u32`を宣言する。これにより`next()`の戻り値、`collect()`、`map()`などの一連のAPIが、同じ要素型を前提として連携できる。

標準`Iterator`の抽象化が興味深いのは、単に`next()`を使い回せることではない。**`next()`が返す型までTraitの契約に含められること**だ。[Rust BookのAdvanced Traits](https://doc.rust-lang.org/book/ch20-02-advanced-traits.html)も、この例を関連型の基本として説明している。

### 8.3 Genericな型パラメータとAssociated Typeは何が違うのか

Associated TypeとGenericsは似ている。しかし、**誰が型を選択できるか**という点に違いがある。

```rust
trait Convert<T> {
    fn convert(&self) -> T;
}

struct Number(u8);

impl Convert<u16> for Number {
    fn convert(&self) -> u16 { u16::from(self.0) }
}

impl Convert<String> for Number {
    fn convert(&self) -> String { self.0.to_string() }
}

fn main() {
    let value = Number(42);
    let number: u16 = value.convert();
    let text: String = value.convert();
    assert_eq!((number, text.as_str()), (42, "42"));
}
```

`Convert<T>`では`T`がTraitの型パラメータに含まれるため、`Number`は`Convert<u16>`と`Convert<String>`を**別々に実装**できる。一方、`Iterator`のように型パラメータを持たないTraitでは、同じ具体型に対する実装を要素型ごとに重複定義できず、1つの実装の`Item`で要素型が決まる。一般には、Trait自身がGenericなら、その型引数の組み合わせごとに関連型が決まる。

| 比較 | `trait Convert<T>` | `trait Iterator { type Item; }` |
| --- | --- | --- |
| 型の指定位置 | Traitの型引数 | Trait実装内の関連型 |
| 同じ実装型への異なる組み合わせ | `Convert<u16>`と`Convert<String>`を別々に実装できる | 同じ具象型への`Iterator`実装を要素型だけ変えて重複定義することはできない |
| APIの意図 | 同じ型が複数の変換先を扱う | 実装型ごとに反復要素の型が定まる |
| 参照方法 | `Convert<T>` | `I::Item`、`<I as Iterator>::Item` |

つまり、関連型は**「型を選択する自由度」を、APIの利用側から実装側の契約へ移す**道具とも言える。したがって、Genericsと関連型は競合する仕組みではなく、**同じ型の関係をどこで固定するか**を設計するための相補的な道具だ。

### 8.4 Associated Typeは型推論とTrait Boundsもつなぐ

関連型があると、「入力の要素型は何でもよいが、その要素は表示可能でなければならない」という制約を表現できる。

```rust
use std::fmt::Display;

fn join_display<I>(values: I) -> String
where
    I: IntoIterator,
    I::Item: Display,
{
    values
        .into_iter()
        .map(|value| value.to_string())
        .collect::<Vec<_>>()
        .join(", ")
}

fn main() {
    assert_eq!(join_display([10, 20, 30]), "10, 20, 30");
}
```

`I: IntoIterator`という制約から`I::Item`が定まり、その`Item: Display`という**追加の型制約**を積み上げられる。型推論はメソッド呼び出しや引数の情報を使って型の整合性を調べ、関数の本体は具体的な要素型を知らないまま書ける。

関連型の名前が曖昧な場合は`<I as IntoIterator>::Item`という**完全修飾構文**（Fully Qualified Syntax）も使用できる。

さらに、次のような関連型の等式制約も書ける。

```rust
fn sum_u32<I>(values: I) -> u32
where
    I: IntoIterator<Item = u32>,
{
    values.into_iter().sum()
}
```

これは「どんな`IntoIterator`でもよい」より強く、**取り出される値の型が`u32`である**ことまで契約にする。Traitは振る舞いを、関連型はその振る舞いに現れる型の関係を表す。

### 8.5 Associated Constantとデフォルト実装

Traitで関連付けられるのは型だけではない。**関連定数（Associated Constant）**も宣言できる。

```rust
trait Protocol {
    type Message;
    const VERSION: u8;

    fn encode(&self, value: Self::Message) -> Vec<u8>;

    fn version(&self) -> u8 {
        Self::VERSION // デフォルト実装
    }
}

struct TextProtocol;

impl Protocol for TextProtocol {
    type Message = String;
    const VERSION: u8 = 1;

    fn encode(&self, value: String) -> Vec<u8> {
        value.into_bytes()
    }
}

fn main() {
    let p = TextProtocol;
    assert_eq!(p.version(), 1);
    assert_eq!(p.encode("hello".to_owned()), b"hello".to_vec());
}
```

ここでは、**関連型＝扱うデータの種類、関連定数＝実装が定める値、メソッド＝操作**という3つの要素が、1つのTraitとしてまとまっている。

ただし、現在のRustでは関連定数を持つTraitをそのまま`dyn Trait`にできないなど、動的ディスパッチとの制約がある。便利な構文を無条件に組み合わせられるわけではない。

### 8.6 GAT：関連型そのものにライフタイムなどの引数を持たせる

Generic Associated Types（GAT）は、Associated Typeをさらに拡張し、**関連型に型・ライフタイム・定数のパラメータを持たせる**仕組みである。Rust 1.65で安定化された機能で、所有権・借用と抽象化を結び付けるうえで特に興味深い。[Rust公式ブログの安定化記事](https://blog.rust-lang.org/2022/10/28/gats-stabilization/)も参照。

```rust
trait View {
    type Borrowed<'a>
    where
        Self: 'a;

    fn view(&self) -> Self::Borrowed<'_>;
}

struct Text(String);

impl View for Text {
    type Borrowed<'a> = &'a str where Self: 'a;

    fn view(&self) -> Self::Borrowed<'_> {
        self.0.as_str()
    }
}

fn main() {
    let text = Text("hello".to_owned());
    let borrowed = text.view();
    assert_eq!(borrowed, "hello");
}
```

`View::Borrowed<'a>`は1つの固定された型ではなく、**借用期間`'a`に応じて具体化される型の族**を表す。この例では`&'a str`だが、別の実装では`&'a [u8]`や、所有者から借用する専用のView型にもできる。

重要なのは、単にジェネリックにしたことではない。**返り値の型が、`self`からの借用期間に結び付く**という関係を、Traitの中で抽象化できる点だ。この考え方は、要素を自分自身の内部から貸し出す*Lending Iterator*などの設計に接続する。

ただし、GATを備えたTraitの動的オブジェクト化には制限があり、GATが安定化されたからといってあらゆる高階の型関係を表現できるわけではない。特にHigher-Ranked Trait Boundsなどと組み合わせる場合には、現在の実装上の制約も確認したい。

### 8.7 `impl Trait`と`dyn Trait`：抽象化と実行時の選択を分離する

Traitに対する抽象化には、少なくとも2つの方向がある。

```rust
fn static_area<T: Area>(shape: &T) -> f64 {
    shape.area()
}

fn dynamic_area(shape: &dyn Area) -> f64 {
    shape.area()
}
```

前者はGenericsに基づく静的ディスパッチを可能にする。通常のコード生成では、具象型ごとの単相化（Monomorphization）と最適化が働く。後者はTrait Objectを使い、実行時にメソッドの実装を選ぶ動的ディスパッチである。

戻り値でも、具体的な型を外へ公開しない`impl Trait`と、型の異なる実装をまとめて扱える`dyn Trait`を使い分けられる。

```rust
fn squares() -> impl Iterator<Item = u32> {
    (0..3).map(|x| x * x)
}

fn boxed_squares() -> Box<dyn Iterator<Item = u32>> {
    Box::new((0..3).map(|x| x * x))
}
```

`impl Iterator<Item = u32>`は**関数が返す具体型を1つに定めつつ、その名前を公開しない**。`Box<dyn Iterator<Item = u32>>`は型消去したTrait Objectで、一般に間接参照による動的ディスパッチが使われる。`Box`を使う例ではヒープ確保も伴うが、`&dyn Trait`のような借用Trait Objectも使える。

関連型を持つTrait Objectでは、`Iterator<Item = u32>`のように、**オブジェクトの利用側が必要とする関連型を具体化する**ことが重要になる。

ただし、すべてのTraitを`dyn`にできるわけではない。たとえばメソッド自体のGenerics、Associated Constant、GAT、`Self`を返すメソッドなどには、**Dyn Compatibility**（従来のObject Safety）上の制約がある。[Rust ReferenceのTraits](https://doc.rust-lang.org/reference/items/traits.html)で確認できる。

抽象化を採用した時点で必ず動的ディスパッチのコストを支払う、という構図ではない。**静的に解決するか、動的ディスパッチを選ぶかをAPIごとに設計できる**ことがRustの特徴である。

### 8.8 Supertrait・Blanket Impl・Coherence：抽象化の整合性を守る

Traitは他のTraitを前提条件にもできる。たとえば`trait Named: std::fmt::Display`は、`Named`を実装する型が`Display`も実装していることを要求する。これは*Supertrait*という仕組みであり、クラスの実装継承と同じではない。

また、一定の制約を満たす多くの型に、まとめてTraitを実装する**Blanket Implementation**も使える。

```rust
use std::fmt::Display;

trait Label {
    fn label(&self) -> String;
}

impl<T: Display> Label for T {
    fn label(&self) -> String {
        self.to_string()
    }
}

fn main() {
    assert_eq!(42.label(), "42");
}
```

「`Display`ができる型なら`Label`も使える」という関係を、1回の実装で表現している。しかし、自由にTraitを実装できると、異なるライブラリが**同じ型とTraitの組み合わせに矛盾する実装**を与えてしまう。

そのためRustにはCoherence（実装の一貫性）やOrphan Ruleがある。基本的には、Traitか対象の型の少なくとも一方が自身のクレートに属することなどが要求され、重複する実装も制限される。厳密な規則には型パラメータやFundamental Typeに関する条件もある。[Rust ReferenceのImplementations](https://doc.rust-lang.org/reference/items/implementations.html)を参照。

これは拡張性の制約にもなるが、**あるTrait呼び出しにどの実装が対応するかを一貫して決定するための設計**である。外部型に外部Traitを実装したいときは、Newtype Patternなどが選択肢になる。

### 8.9 Traitは「関連する型と操作の契約」を合成する仕組み

Rustの抽象化を総括すると、個々の要素が次のように働いている。

| 機能 | 何を抽象化するか | 例 |
| --- | --- | --- |
| Trait | 型に要求する振る舞い | `Display`、`Clone` |
| Generics / Trait Bounds | 多くの型に通用する処理と制約 | `T: Display` |
| Associated Type | 実装に結び付いた別の型 | `Iterator::Item` |
| Associated Constant | 実装に結び付いた定数 | `Protocol::VERSION` |
| GAT | パラメータに応じて変わる関連型の族 | `View::Borrowed<'a>` |
| Supertrait | 抽象化が前提とする別の契約 | `trait Named: Display` |
| Blanket Implementation | 条件を満たす型への一括実装 | `impl<T: Display> Label for T` |
| `impl Trait` / `dyn Trait` | 静的な具象型隠蔽と実行時の型消去 | `impl Iterator` / `dyn Iterator` |

これは、単なる「継承の代わり」ではない。**振る舞いと、その振る舞いに現れる型の関係を記述し、所有権・型推論・ディスパッチ・コンパイラ最適化へ接続する仕組み**である。

その能力は学習コストや複雑な型エラー、Coherence制約も伴う。特にすべての抽象化が常にゼロコストになるわけではなく、Genericsによるコードサイズ増大や動的ディスパッチの実行時コストも考慮すべきだ。それでも、**これだけ異なる抽象化の要素が、同じ型システムのもとで首尾一貫して使える**ことは、Rustの言語設計を特徴づける重要な魅力だ。

---

[シリーズ目次](./) ｜ [参考資料](references.md)
