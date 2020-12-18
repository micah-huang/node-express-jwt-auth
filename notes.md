Cookies:

- Cookies store data in a user's browser


JWT:

- Header: defines signature and metadata
- Payload: Contains user information
- Signature: Hashes the header and payload together

The header and payload are hashed using a secret algorithm with the algorithm defined in the header
--> the result is the signature which is used to confirm that the data has not been tampered with