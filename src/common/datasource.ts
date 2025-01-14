import { Membership } from "src/membership/membership.entity";
import { DataSource } from "typeorm";

export const dataSource = new DataSource({
  host: "localhost",
  port: 5432,
  database: "postgres",
  username: "postgres",
  password: "password",
  type: "postgres",
  synchronize: true,
  entities: [Membership]
})