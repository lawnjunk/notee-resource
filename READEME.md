notes resource rest api
=======================

dev notes
---------
** auth not implemented: ignore eats **

api docs
--------

# users

# notes
#### GET /api/notes
#### GET /api/notes/:id
#### POST /api/notes
**REQUEST**
* body: 
 ` {text: String-REQUIRED, eat: EatToken-REQUIRED} `
 * **text** - contents of the note
 * **eat** - EAT auth token, recieved at login
**RESPONCE**
* body:
 * success: 
  ` {success: true, note: Note} `
 * failure:
  ` {success: false, err: "err msg"} `
  * **success** - Boolean, representing success of request, false when internal server error
   * **err** - String, explination of error.
  * **note** - Object, Note object

#### PATCH /api/notes/:id
#### DELETE /api/notes/:id
