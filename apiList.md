# DevTinder APIs

## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter
# for send
- POST /request/send/interested/:userId |- /request/send/:status/:userId
- POST /request/send/ignored/:userId    |
# for review
- POST /request/review/accepted/:requestId | - /request/review/:status/:userId
- POST /request/review/rejected/:requestId |

## userRouter
- GET /user/connections
- GET /user/requests
- GET /user/feed - Gets you the profiles of other users on platform
 

 status: ignore, interested, accepted, rejected

 

 ## homework

 - $or query and $and query in mongodb
 - schema.pre()
 - read more about the indexes in mongodb
 - why do we need the indexes in mongodb
 - what is the advantage of creating the index
 - read the article about the compound indexes
 - always think about corner cases