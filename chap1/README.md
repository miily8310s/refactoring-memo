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