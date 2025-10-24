import { writeFileSync } from "fs";
const argv = process.argv.slice(2);

if (argv.length !== 2) {
  console.error(
    "\nInvalid number of arguments. Expected 2 arguments: ACCESS_KEY SECRET_KEY\n"
  );
  process.exit(1);
}

const [accessKey, secretKey] = argv;
console.log("Saving .env file with provided credentials...");
writeFileSync(
  ".env",
  `MINIO_ACCESS_KEY=${accessKey}\nMINIO_SECRET_KEY=${secretKey}\n`
);
console.log("Successfully saved .env file.");
