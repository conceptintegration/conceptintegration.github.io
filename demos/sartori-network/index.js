const init = async () => {
    model = await use.load();
    document.querySelector('#loading').style.display = 'none';
    document.querySelector('#loaded').style.display = 'inherit';
    document.querySelector('#app').style.display = 'inherit';
};
init();

ccp_labels = [];

for (let i = 0; i < Object.keys(nodesData).length; i++) {
    ccp_labels.push(nodesData[Object.keys(nodesData)[i]][2]);
};

$("#id_form").on("submit", async function () {
    $("#container").empty();
    var text_new = [];
    text_new.push(document.getElementById("inputconcept").value);
    var scores = [];
    var scores_norm = [];
    embeddings_new = await model.embed(text_new);
    const sentenceI = embeddings_new.slice([0, 0], [1]);

    for (let i = 0; i < ccp_labels.length; i++) {
        const sentenceJ_labels = embeddings.slice(i, i + 1);
        const score_this = sentenceI.matMul(sentenceJ_labels, false, true).dataSync();
        scores.push(score_this);
    };

    // https://stackoverflow.com/a/39777131
    function normalize(min, max) {
        var delta = max - min;
        return function (val) {
            return (val - min) / delta;
        };
    }

    var scores_norm = scores.map(normalize(Math.min.apply(Math, scores), Math.max.apply(Math, scores)));
    var colors = scores_norm.map(scale.viridis);

    // Create a graphology graph
    var graph = new graphology.Graph();

    // Add nodes
    
    for (let i = 0; i < Object.keys(nodesData).length; i++) {
        graph.addNode(Object.keys(nodesData)[i], {
            id: Object.keys(nodesData)[i],
            label: nodesData[Object.keys(nodesData)[i]][2],
            x: parseFloat(nodesData[Object.keys(nodesData)[i]][0]),
            y: parseFloat(nodesData[Object.keys(nodesData)[i]][1]),
            size: parseInt(nodesData[Object.keys(nodesData)[i]][3]),
            color: colors[i],
            valsim: 3
        });
    };

    // Add edges
    for (let i = 0; i < Object.keys(edgesData).length; i++) {
        graph.addEdge(
            edgesData[Object.keys(edgesData)[i]][0].toString(),
            edgesData[Object.keys(edgesData)[i]][1].toString()
        );
    };

    // function to get ordered indices
    // https://stackoverflow.com/a/54323161
    function orderIndices(arr) {
        oi = arr.map((val, ind) => {
                return {
                    ind,
                    val
                }
            })
            .sort((a, b) => {
                return a.val > b.val ? 1 : a.val == b.val ? 0 : -1
            })
            .map((obj) => obj.ind);
        return oi.reverse()
    }

    // Instantiate sigma.js and render the graph
    var sigmaInstance = new Sigma(graph, document.getElementById("container"));

    return false;
});