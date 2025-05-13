# lab

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.13. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## アーキテクチャ概要

本プロジェクトは、クリーンアーキテクチャや DDD（ドメイン駆動設計）の考え方を参考に、以下の 3 層構造で設計されています。

### 1. domain 層（ドメイン層）

- ビジネスロジックの中心となる型定義やエンティティ、ドメインサービスを定義します。
- 例: `RequestType`, `PendingRequest`, `ApprovedRequest` などのリクエスト型、`isPendingRequest` などのタイプガード関数。
- コマンド（`request-commands.ts`）、イベント（`request-events.ts`）、基本型（`types.ts`）もここに含まれます。

### 2. application 層（アプリケーション層）

- ユースケースやアプリケーションサービス、コマンドハンドラ、リポジトリインターフェースを定義します。
- 例:
  - サービス: `ApproverServiceImpl`, `RequesterServiceImpl`
  - ハンドラ: `RequestCommandHandler`
  - リポジトリインターフェース: `RequestRepository`
- ドメイン層の型やロジックを利用し、インフラ層に依存しない形でビジネスユースケースを実現します。

### 3. infrastrucutre 層（インフラ層）

- 実際のデータ保存や ID 生成など、外部システムとのやりとりを担当します。
- 例:
  - `RequestRepositoryImpl`（リクエストの永続化・キャッシュ管理）
  - `InMemoryEventStore`（イベントストアのインメモリ実装）
  - `id-genenrator.ts`（UUID やタイムスタンプ生成のユーティリティ）

### 4. エントリーポイント

- `src/index.ts` では、各層の実装を組み合わせて実際のユースケース（例: 申請作成、承認、却下、キャンセルなど）を実行する例が記載されています。

---

## ディレクトリ構成

```
src/
  domain/         # ドメインモデル・型定義
  application/    # サービス・ユースケース・リポジトリインターフェース
  infrastrucutre/ # リポジトリ実装・ID生成・イベントストア
  index.ts        # エントリーポイント・サンプル実行
```

---

## 各層の依存関係

- domain 層は他層に依存しません。
- application 層は domain 層に依存しますが、infrastructure 層には依存しません（インターフェース経由）。
- infrastructure 層は domain 層・application 層のインターフェースを実装します。

---

この構成により、ビジネスロジックとインフラの分離、テスト容易性、拡張性を高めています。
