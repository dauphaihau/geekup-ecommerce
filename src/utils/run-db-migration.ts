import { execSync } from 'child_process';

export const runDbMigration = async () => {
  try {
    console.log('Running dbmate migrations...');
    // Execute dbmate up command
    execSync('pnpm migrate:dev:up', { stdio: 'inherit' });
    console.log('Migrations executed successfully');
  } catch (error) {
    console.error('Error running dbmate migrations:', error);
    process.exit(1); // Exit or handle error as needed
  }
};
