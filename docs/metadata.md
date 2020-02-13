
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

In the frontend we try to parse the `metadata` as a json object.

### metadata - Json object

We are going to try to find the following keys:

1. `description`
2. `agreementText`
3. `defendant`
4. `plaintiff`

#### metadata - String

In case that the metadata is just a plain string we are going to use it as the dispute description and the dispute creator `subject.id` will be considered as the plaintiff


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

The dashboard check if the `data` field is a valid IPFS hash/cid

### data - IPFS hash

Try to fetch the content from IPFS

#### content - Json

We are going to try to find the following keys:

1. `metadata`

If we can find it we are going to show that as the evidence text

#### content - String

Show the content as the evidence text

### data - Plain String

Show the data as the evidence text

