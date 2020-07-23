
## Dispute

Structure from the graph

```javascript
type Dispute @entity {
  id: ID!
  ...
  subject: Arbitrable!
  metadata: Bytes!
  disputable: Disputable!
  ...
}
```

```javascript
type Arbitrable @entity {
  id: ID!
  disputes: [Dispute!] @derivedFrom(field: "subject")
}
```

```javascript
type Disputable @entity {
  id: ID!
  dispute: Dispute!
  title: String!
  agreement: String!
  actionId: BigInt!
  address: Bytes!
  disputableActionId: BigInt!
  defendant: Bytes!
  plaintiff: Bytes!
  organization: Bytes
}
```

### Aragon court handles two different types of disputes:

- **Raw disputes**: disputes that were not created through an Agreement; most likely created manually
- **Disputables**: disputes that were created through an Agreement due to an action being challenged on an Aragon organization

In the following section, we'll break down how we handle metadata for these two types.

## Raw disputes

The dispute `metadata` should be a JSON Object and should have the following keys:
1. `description`
2. `metadata`

If `metadata` is a string in the form of `ipfs:{CID | IPLD path}`, we'll fetch its content through IPFS.
The content is expected to have the following structure:

```javascript
{
  "description": …,
  "disputedActionText": …,
  "disputedActionURL": …,
  "disputedActionRadspec": …,
  "agreementTitle": …,
  "agreementText": …,
  "organization":  …,
  "plaintiff": …,
  "defendant": …,
}
```

> Note that even though `description` should be present in the IPFS content, we also assume it to be present in the `metadata` field. We do this to avoid needing to fetch every disputes' IPFS content when loading their dispute cards.

## Disputables

The dispute metadata should be in the `disputable` attribute of the subgraph's `dispute` entity.

```javascript
  title              // description
  agreement          // String in the form of `ipfs:{CID | IPLD path}` corresponding to the agreement content
  actionId           // Action id of the disputed action relative to the agreement app
  address            // Address of the disputable app where the disputed action is taking place
  disputableActionId // Action id of the disputed action relative to the disputable app (e.g. in the context of the disputable voting app, if a vote is being disputed, disputableActionId is the vote id)
  defendant          // Address of the submitter of the disputed action
  plaintiff          // Address of the challenger of the disputed action
  organization       // Address of the organization where the disputed action is taking place
```

---

## Evidence

```javascript
type Evidence @entity {
  id: ID!
  ...
  data: String!
  submitter: Bytes!
  ...
}
```

The dashboard checks if the `data` field is a string in the form of `ipfs:{CID | IPLD path}`.

### data - IPFS path

Try to fetch the content from IPFS

  - **content - JSON**

      We are going to try to find the following keys:

       1. `metadata`

      If we can find it we are going to show that as the evidence text

  - **content - String**
      
      Show the content as the evidence text

### data - Plain String

Show the data as the evidence text
