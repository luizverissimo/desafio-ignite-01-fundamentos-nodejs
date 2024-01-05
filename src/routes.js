import { Database } from "./database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-route-path.js";
import { verifyIdExists } from "./middlewares/ verifyIfFieldsExists.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    callback: (request, response) => {
      const task = database.select("tasks");

      response
        .setHeader("Content-type", "application/json")
        .end(JSON.stringify(task));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    callback: (request, response) => {
      const { title, description } = request.body;
      const missedField = verifyIdExists(request, response, [
        "title",
        "description",
      ]);
      if (missedField.length > 0) {
        return response.writeHead(400).end(
          JSON.stringify({
            error: `O(s) campo(s) ${missedField.join(
              ","
            )} devem ser informado(s)!`,
          })
        );
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      database.insert("tasks", task);
      response.writeHead(201).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    callback: (request, response) => {
      const { id } = request.params;
      const { title, description } = request.body;

      const missedField = verifyIdExists(request, response, [
        "title",
        "description",
      ]);
      if (missedField.length > 0) {
        return response.writeHead(400).end(
          JSON.stringify({
            error: `O(s) campo(s) ${missedField.join(
              ","
            )} devem ser informado(s)!`,
          })
        );
      }

      const task = database.selectById("tasks", id);
      if (!task)
        return response
          .writeHead(404)
          .end(JSON.stringify({ error: "Task nao encontrada" }));

      const taskUpdate = { title, description };

      database.update("tasks", id, taskUpdate);

      response.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    callback: (request, response) => {
      const { id } = request.params;
      const task = database.selectById("tasks", id);
      if (!task)
        return response
          .writeHead(404)
          .end(JSON.stringify({ error: "Task nao encontrada" }));

      database.delete("tasks", id);
      response.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    callback: (request, response) => {
      const { id } = request.params;

      const task = database.selectById("tasks", id);
      if (!task)
        return response
          .writeHead(404)
          .end(JSON.stringify({ error: "Task nao encontrada" }));

      const completed_at = new Date();
      database.update("tasks", id, { completed_at });

      response.writeHead(204).end();
    },
  },
];
