import { exec } from 'child_process';

const command = `npm run typeorm:cli -- migration:generate src/shared/infra/database/typeorm/migrations/${process.argv[2]}`;

(() => exec(command, (error, stdout, stderr) => {
  if (error !== null) {
    console.error(stderr);
  }
  console.log(stdout);
}))();