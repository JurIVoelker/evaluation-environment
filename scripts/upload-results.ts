import { Client } from "minio";
import archiver from "archiver";
import fs from "fs";
import { v6 } from "uuid";
import { writeFile } from "fs/promises";
import "dotenv/config";

const argv = process.argv.slice(2);

if (!process.env.MINIO_ACCESS_KEY || !process.env.MINIO_SECRET_KEY) {
  console.error(
    "\nMINIO_ACCESS_KEY and MINIO_SECRET_KEY environment variables are required.\n"
  );
  throw new Error("Missing S3 (Minio) credentials");
}

function getArg(name: string) {
  const long = `--${name}`;
  const short = `-${name[0]}`;
  const i = argv.findIndex((a) => a === long || a === short);
  if (i >= 0 && argv[i + 1]) return argv[i + 1];
  return undefined;
}

const group = (getArg("group") ?? argv[0]).toUpperCase();
const userId = `${group}_` + v6();

if (group !== "A" && group !== "B") {
  console.error(
    "\nInvalid group specified:",
    group,
    "Expected 'A' or 'B'. Please copy the whole command. \n"
  );
  throw new Error("Invalid group specified");
}

const minio = new Client({
  endPoint: "s3.voelkerlabs.de",
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
  useSSL: true,
});

const BUCKET = "ui-lib-testing";

const saveIdToFile = async () => {
  try {
    console.log("Saving id to id.txt");
    await writeFile("id.txt", userId);
    console.log("Successfully saved id to file 'id.txt'");
  } catch (err) {
    console.error("Error while saving user ID to file");
  }
};

const archiveResults = async () => {
  try {
    // Zip the src directory
    console.log("Zipping results...");
    const output = fs.createWriteStream("code.tar");
    const tar = archiver("tar", { zlib: { level: 9 } });

    tar.on("error", (err) => {
      console.log("Error while creating archive");
      throw err;
    });

    tar.directory = (src: string, dest: string, data?: any) =>
      tar.glob(
        "**/*",
        {
          cwd: src,
          dot: true,
          ignore: ["**/node_modules/**", "**/.next/**"], // exclude node_modules and .next
        },
        { prefix: dest }
      );

    tar.pipe(output);
    tar.directory("mui", "mui");
    tar.directory("shadcn", "shadcn");
    await tar.finalize();
    console.log("Successfully created archive 'code.tar'");
  } catch (err) {
    console.error("Error while archiving results:", err);
  }
};

const uploadArchive = async () => {
  // Upload the archive to S3
  console.log("Uploading archive to S3...");
  await minio.fPutObject(BUCKET, `${userId}/code.tar`, "code.tar");
  console.log("Successfully uploaded archive 'code.tar' to S3");
};

(async () => {
  await saveIdToFile();
  await archiveResults();
  await uploadArchive();
  console.log("All done!");
  console.log(
    '\nYou can copy your user ID from the file "id.txt" or copy it here: \n' +
      userId +
      "\n"
  );
})();
