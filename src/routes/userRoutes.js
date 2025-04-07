import { createUser } from "../controllers/userController.js";
import { userSchema } from "../validators/userValidator.js";

export default [
  {
    method: "POST",
    path: "/api/users",
    options: {
      plugins: {
        "hapi-rate-limit": {
          userLimit: 5,
          duration: 60000,
        },
      },
      validate: {
        payload: userSchema,
        failAction: (request, h, err) => {
          return h
            .response({ error: err.details[0].message })
            .takeover()
            .code(400);
        },
      },
    },
    handler: createUser,
  },
];
