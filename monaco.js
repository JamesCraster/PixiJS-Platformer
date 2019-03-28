monaco.editor.create(document.getElementById("monacoContainer"), {
    value: "/* Write your code in javascript, and hit run to see the player move. \n" +
        "To control the player directly with the arrow keys, click on the game. \n" +
        "When ready, hit 'fight' to pit your solution against others!*/ \n \n" +
        "function update() {\n\tplayer.move = 'right';\n}" +
        "\n\n/*The API is extremely simple:  \n" +
        `player.move can be "left" or "right" or "stop" \n` +
        "Call player.jump(1000) to hold down jump for 1000 milliseconds. \n" +
        "player.x and player.y store the player's position.\n" +
        "opponent.x and opponent.x store the opponent's position.\n" +
        "Call scan(1,5) to scan the square at x = 1, y = 5 (from the top left.)\n" +
        "The stage is always 16 * 16 squares. \n" +
        'A square can be "Empty", "Stone" or "Ladder"\n' +
        "There is a 10,000 line limit on solutions. */",
    language: "javascript",
    theme: "vs-dark",
    automaticLayout: true
});