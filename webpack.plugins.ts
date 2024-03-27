import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import CopyPlugin from "copy-webpack-plugin";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

export const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: 'webpack-infrastructure',
  }),
  new CopyPlugin({
    patterns: [
      // important to get the right path of the query engine and copy it to webpack/main
      { from: "node_modules/@prisma/engines/query_engine-windows.dll.node", to: "./query_engine-windows.dll.node" },
    ],
  }),
];
