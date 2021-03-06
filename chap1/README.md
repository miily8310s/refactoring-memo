# 第１章 リファクタリング- 最初の例

## 着手前のコメント

## コードの問題点

- 演劇の分類方法と料金系のルール変更に対処するためには、`statement`関数を書き換える必要がある
- さらにルールが複雑化した場合、どこを変更すべきかがますますわかりにくくなり、誤りなく実施することも困難になる
  - → リファクタリングへの原動力

## リファクタリングへの流れ

- コードの動作を理解して、流れを追わなければならない状況になったときには、行動を起こす必要がある
- ※コードを今後変更する予定がないなら、放置しても問題ない

## リファクタリングの第一歩

- リファクタリングを行うとき常に最初にすること： 対象となるコードに対してテスト群を作ること
  - プログラムが大きくなるほど、加えた変更が意図せず他の部分を壊してしまう可能性があるため
  - テストは思わぬ間違いから守ってくれるバグ発券器のようなもの
- `statement`関数の戻り値は文字列
  - 請求明細をいくつか作り、明細ごとにさまざまな種類の演劇が含まれるように → 請求書の文字列を生成
  - 想定される正しい結果の文字列と比較
- テストフレームワークを使って、開発環境のコマンド一つでまとめて実行できるようにする
- コードそのものとテストコードの２回書く
- テストの作成には時間がかかるが、後のデバッグの時間が減り、ずっと得できる

## statement 関数の分割

- 中央付近にある switch 文を`amountFor`関数として別途切り出す
- 「**関数の抽出**」を行う
  - コードを関数に抽出することで、スコープ外になる変数がないかを見定める
  - 本書では関数の戻り値の変数名を常に`result`としている
- 抽出が完了したら、壊れていないかを確認するため、テストする
- リファクタリングのたびにテストをするのは大切な習慣
- リファクタリングが成功するたびに git にコミットすると良い

## play 変数の削除

- `play`は`performance`から取得できるため、パラメータで取得する必要はない
  - `amountFor`関数の中でいつでも取り出せる
- 長い関数を分割していくときには、`play`のような変数を排除すべき
  - 一時変数があるとローカルスコープの変数が増えてしまい、排出が面倒になるため
- まずは「**問い合わせによる一時変数の置き換え**」を行う
- 次に「**変数のインライン化**」を行う
- 最後に「**関数宣言の変更**」を行う

## ボリューム特典ポイントの計算部分の抽出

- `play`変数は排除できたが、まだ２つのローカル変数を排除する必要がある
- `perf`変数は簡単に引数として渡せる
- `volumeCredits`はループ中で値が更新されるので少し厄介

## format 変数の削除

- 一時変数は問題のもと
- 最も簡単な`format`を別の関数として独立させる
- 独立させたが、メソッド名が`format`だと何をしているのかを十分に表していない
- ここで強調すべきは金額のフォーマットを行っていることなので、「**関数宣言の変更**」を行う
- 名前付けは重要かつ難しいこと
  - 大きな関数を小さく分割できても、名前が悪ければ価値はない
  - 名前が適切なら、何をしているか突き止めようと関数の中身を読む必要がなくなる
  - とはいえ、最初から適切な名前をつけるのは難しい
- リファクタ時に浮かんだベストな名前をつけ、あとから積極的に修正するようにする
- しばらくしてから振り返るとベストな名前が見つかることがある

## ボリューム特典ポイント集計箇所の削除

- 次に目指すのは`volumeCredits`の削除
- 「**ループの分離**」を用いて、`volumeCredits`を集計している箇所を分離
- `volumeCredits`変数の更新部分を 1 箇所にまとめたので、まずこの変数の計算処理全体を「**関数の抽出**」により独立させる
- すべてを抽出したら「**変数のインライン化**」を適用できる
- リファクタリングによるパフォーマンスへの影響について
  - リファクタリングによってパフォーマンスに重要な影響を与えることはある
  - たとえそうなっても作業は継続すべき
  - よく整理されたコードの方が、あとからパフォーマンスの最適化がしやすい
- `volumeCredits`の削除で踏んできたステップ
  - 「**ループの分離**」：値の集計処理を分離するため
  - 「**ステートメントのスライド**」：初期化の処理を集計処理の直前に移動させるため
  - 「**関数の抽出**」：合計を計算する関数を定義するため
  - 「**変数のインライン化**」：変数を完全に削除するため
- 同様の手順で`totalAmount`変数も削除する

## 計算とフォーマットにフェーズを分割

- 次は機能の変更に入っていく（HTML でも出力できるように修正）
- 計算のコードは分離されているので、トップレベルの７行ほどの関数に対応した形で、HTML を出力するためのコードを書くだけ
- 問題となるのは、分割した関数がすべて`statement`関数の中に記述されていること
  - HTML/プレーンテキスト出力用に同じ計算関数群を使いまわしたくない
- これを実現する方法
  - 筆者としては「**フェーズの分離**」がよい
  - ここでは全体の処理を二つのフェーズに分ける
    - 前半は請求書出力のためのフェーズに中間的なデータ構造を作り、後半フェーズに渡す
    - 後半フェーズではデータをプレーンテキストや HTML に出力する
- 計算処理をすべて`createStatementData`関数に移動し、`renderPlainText`は引数`data`で渡されたデータを加工するだけにできる
  - `playFor`および`amountFor`を`statement`関数に移動
- `createStatementData`関数は別ファイルへ移動
- 最後に HTML 出力用に`renderHTMLStatement`関数を作成し、引数に`createStatementData`関数を指定

## 型による計算処理の再編成

- 新たな機能追加を見ていく
- 演劇の種類を増やして、それぞれで異なる料金とボリュームを設定できるようにしたいという要求
- 今のところ、変更を加えるには計算を行っている関数内の条件を編集しなければいけない
  - `amountFor`関数で演劇の種類（`type`）が中心的な役割を果たしている
  - こうした条件ロジックはプログラミング言語の構造的要素によって補強しないと修正につれて荒廃していく
- 構造を導入し条件記述の存在を明示する方法
  - ポリモーフィズムを利用する
- 継承階層を導入して、悲劇や喜劇といったそれぞれの計算ロジックを持てるようにする
- ボリューム特典ポイントの計算についても、似たような構造を導入する
- 中心となるリファクタリングは「**ポリモーフィズムによる条件記述の置き換え**」

## ここまでの現状確認

- 演劇の種類が増えたら、新しいサブクラスを定義し、それをファクトリ関数に追加すれば良い
- サブクラスは、方に応じた振る舞いをする関数が増えるほど、有効になる

## まとめ

- 本章では簡単な例でリファクタリングを紹介してきた
- 大きく分けて三つの段階が今回のリファクタリングにあった
  1. 元の大きな関数を分解し、小さくネストした関数の集まりにした
  2. 「**フェーズの分離**」で計算とフォーマットのコードを分離
  3. 計算ロジックの分離のため、ポリモーフィズムを使った計算を導入
