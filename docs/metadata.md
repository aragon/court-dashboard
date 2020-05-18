
## Dispute

Structure from the graph

```javascript
type Dispute @entity {
  id: ID!
  ...
  subject: Arbitrable!
  metadata: Bytes!
  ...
}
```

```javascript
type Arbitrable @entity {
  id: ID!
  disputes: [Dispute!] @derivedFrom(field: "subject")
}
```

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
