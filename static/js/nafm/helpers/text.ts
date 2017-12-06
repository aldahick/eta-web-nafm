export default class HelperText {
    private static canvas: HTMLCanvasElement;

    /**
     * Borrowed and modified from https://stackoverflow.com/a/21015393
     */
    public static getTextWidth(text: string, font = "13px monospace"): number {
        if (!this.canvas) this.canvas = document.createElement("canvas");
        const context: CanvasRenderingContext2D = this.canvas.getContext("2d");
        context.font = font;
        return context.measureText(text).width;
    }
}
