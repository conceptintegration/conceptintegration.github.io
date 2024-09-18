// Adapted from https://github.com/hpssjellis/beginner-tensorflowjs-examples-in-javascript/tree/master/tfjs-models/universal-sentence-encoder

// License from file above:

/**
* @license
* Copyright 2019 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*/

// import text files as arrays
// https://stackoverflow.com/a/14969784
// https://stackoverflow.com/a/1761437

$( "#ontccp" ).prop( "checked", true );
$( "#ontidea" ).prop( "checked", true );

var merged_td = new Array();

$.ajax({
  async: false,
  type: 'GET',
  url: './data/merged_td.txt',
  success: function(data) {
    merged_td = data.split('\n');
  }
});

merged_td.pop();

var merged_td_ont = new Array();

$.ajax({
  async: false,
  type: 'GET',
  url: './data/merged_td_ont.txt',
  success: function(data) {
    merged_td_ont = data.split('\n');
  }
});

merged_td_ont.pop();

// function to get ordered indices
// https://stackoverflow.com/a/54323161
function orderIndices(arr) {
  oi = arr.map((val, ind) => {return {ind, val}})
          .sort((a, b) => {return a.val > b.val ? 1 : a.val == b.val ? 0 : -1 })
          .map((obj) => obj.ind);
  return oi.reverse()
}

var model;

var embeddings_merged = new Array();

$.ajax({
  async: true,
  type: 'GET',
  url: './embeddings/embeddings_merged_td.txt',
  success: function(data) {
    embeddings_merged = tf.tensor(JSON.parse(data));
  }
});

const init = async () => {
  model = await use.load();
  // embeddings_ccp_td = await model.embed(ccp_td);
  // embeddings_merged_td = await model.embed(merged_td);
  // embeddings_ccp_descriptions = await model.embed(ccp_descriptions);
  // to print tensor as json:
  // JSON.stringify(embeddings_ccp_descriptions.arraySync())
  document.querySelector('#loading').style.display = 'none';
  document.querySelector('#loaded').style.display = 'inherit';
  document.querySelector('#app').style.display = 'inherit';
};
init();

var embeddings_new;

$("#id_form").on("submit", async function(){

  document.querySelector('.lds-dual-ring').style.display = 'inherit';
  document.querySelector('#table-results').style.display = 'none';

  var text_new = [];
  text_new.push(document.getElementById("inputconcept").value);
  var scores = [];
  var ord_indices_scores = [];
  embeddings_new = await model.embed(text_new);
  const sentenceI = embeddings_new.slice([0, 0], [1]);
  
  $("#table-results-tbody").empty();
  
  var table = document.getElementById("table-results").getElementsByTagName('tbody')[0];
  
  for (let i = 0; i < merged_td.length; i++) {
    const sentenceJ_labels = embeddings_merged.slice([i, 0], [1]);
    const score_this = sentenceI.matMul(sentenceJ_labels, false, true).dataSync();
    
    scores.push(score_this);
  };

  var ord_indices_scores = orderIndices(scores);

  for (let i = 0; i < 10; i++) {
    var ind = ord_indices_scores[i] 
    var row = table.insertRow(table.rows.length);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = merged_td_ont[ind];
    cell2.innerHTML = merged_td[ind];
    var s = parseFloat(scores[ind]).toFixed(3);
    cell3.innerHTML = s;
  };
  
  document.querySelector('.lds-dual-ring').style.display = 'none';
  document.querySelector('#table-results').style.display = 'inherit';

  return false;
});

