# bunshin-san-database

This is database server which is a part of Bunshin-san.

Using AWS Lambda and AWS DynamoDB.

## API

### `/users` POST

Create user.

### `/users/{lineuserid}` GET

Get user.

### `/users/{lineuserid}` POST

Update user.

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

It also includes information on books being edited and to be read.

```typescript
interface User {
  lineuserid: string
  name: string
  currentbookid: string
  editbookid: string
}
```

### Book

A collection of Talk.

```typescript
interface Book {
  bookid: string
  lineuserid: string
  talklist?: string[]
}
```

### Talk

Minimum unit to read.
