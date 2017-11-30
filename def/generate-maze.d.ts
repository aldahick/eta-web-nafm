declare module "generate-maze" {
    let generateMaze: (width: number, height: number, shouldCloseEdges?: boolean) => {
        x: number;
        y: number;
        top: boolean;
        left: boolean;
        bottom: boolean;
        right: boolean;
        set: number;
    }[][];
    export = generateMaze;
}
