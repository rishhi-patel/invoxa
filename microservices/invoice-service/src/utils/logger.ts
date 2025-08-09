import chalk from "chalk"

export const logger = {
  info: (msg: string) => {
    console.log(chalk.blueBright(`[INFO] ${new Date().toISOString()} — ${msg}`))
  },
  warn: (msg: string) => {
    console.warn(
      chalk.yellowBright(`[WARN] ${new Date().toISOString()} — ${msg}`)
    )
  },
  error: (msg: string, err?: unknown) => {
    console.error(
      chalk.redBright(`[ERROR] ${new Date().toISOString()} — ${msg}`)
    )
    if (err) console.error(chalk.gray(err))
  },
}
