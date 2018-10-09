# bunshin-san-database

This is database server which is a part of Bunshin-san.

Using AWS Lambda and AWS DynamoDB.

## API

### `/users` POST

Create an user.

### `/users/{lineuserid}` GET

Get an user searched by {lineuserid}.

### `/users/{lineuserid}` POST

Update an user specified by {lineuserid}.

### `/users/{lineuserid}/books` POST

Create book owned by user.

### `/users/{lineuserid}/books/{bookid}` GET

Get book owned by user.

## Responses

### Success

Return HTTP status code at 200.

```typescript
type Resource = User | Book

interface SuccessResponse {
  [resourcename: string]: Resource
}

interface UserResponse extends SuccessResponse {
  User: User
}

interface BookResponse extends SuccessResponse {
  Book: Book
}
```

### Error

Return HTTP status code at 400.

```typescript
interface ErrorRespone {
  Params: any          // Request parameters
  ErrorMessage: string
}
```

## Models

### User

Bunshin-san users.

This model stores typical user information. Additionally, this includes which book User wants to edit and read out.
Edditing book is specified by editbookid.
Reading out book is specified by currentbookid.
```typescript
interface User {
  lineuserid: string
  name: string
  currentbookid: string
  editbookid: string
}
```

### Book

This model stores book information which includes a collection of talks.

```typescript
interface Book {
  bookid: string
  lineuserid: string
  talklist?: string[]
}
```

### Talk

Minimum unit to read out.
