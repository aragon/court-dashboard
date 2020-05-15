
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

In the frontend we try to parse the `metadata` as a JSON object.

### metadata - JSON object

We are going to try to find the following keys:

1. `description`
2. `metadata`

If `metadata` is a valid [native IPFS URL](https://docs.ipfs.io/guides/guides/addressing/#native-urls) we'll fetch its content through IPFS.
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

#### metadata - String

In case `metadata` is a plain string, we assume it to be the dispute's description and set the dispute creator (`subject.id`) as the plaintiff. No agreement link will be available.

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

The dashboard checks if the `data` field is a valid IPFS hash/cid

### data - IPFS hash
  Try to fetch the content from IPFS

  - **content - JSON**

      We are going to try to find the following keys:

       1. `metadata`

      If we can find it we are going to show that as the evidence text

  - **content - String**
      
      Show the content as the evidence text

### data - Plain String

  Show the data as the evidence text
