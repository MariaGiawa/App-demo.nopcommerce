/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 95.23809523809524, "KoPercent": 4.761904761904762};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "Shipping method and Click on Continue"], "isController": true}, {"data": [1.0, 500, 1500, "Billing Address and Clik Continue"], "isController": true}, {"data": [0.5, 500, 1500, "12-1 Order Detail"], "isController": false}, {"data": [1.0, 500, 1500, "2-1 Click on Log in"], "isController": false}, {"data": [1.0, 500, 1500, "Click on Shopping cart"], "isController": true}, {"data": [0.5, 500, 1500, "Confirm Order"], "isController": true}, {"data": [1.0, 500, 1500, "3-2 Clik login"], "isController": false}, {"data": [0.5, 500, 1500, "5-1 Click on Checkout-0"], "isController": false}, {"data": [1.0, 500, 1500, "5-1 Click on Checkout-1"], "isController": false}, {"data": [0.5, 500, 1500, "Order Detail"], "isController": true}, {"data": [1.0, 500, 1500, "6-1 Billing Address and Click on Continue"], "isController": false}, {"data": [0.0, 500, 1500, "Click on Category"], "isController": true}, {"data": [1.0, 500, 1500, "7-2  Click on Continue"], "isController": false}, {"data": [0.5, 500, 1500, "9-1 9-1 Paymen Information and Click on Continue"], "isController": false}, {"data": [0.5, 500, 1500, "Shipping address and Click on Continue"], "isController": true}, {"data": [0.5, 500, 1500, "Input Username & Password and clik login"], "isController": true}, {"data": [0.5, 500, 1500, "5-1 Click on Checkout"], "isController": false}, {"data": [0.0, 500, 1500, "Click on Product"], "isController": true}, {"data": [0.5, 500, 1500, "Paymen method and Clik on Continue"], "isController": true}, {"data": [0.5, 500, 1500, "9-1 Paymen method and Clik on Continue"], "isController": false}, {"data": [0.5, 500, 1500, "11-1 Click Confirm"], "isController": false}, {"data": [1.0, 500, 1500, "Click on Log in"], "isController": true}, {"data": [0.5, 500, 1500, "Paymen Information"], "isController": true}, {"data": [0.0, 500, 1500, "2-2 Click On Product"], "isController": false}, {"data": [1.0, 500, 1500, "3-1 Input Username & Password-1"], "isController": false}, {"data": [1.0, 500, 1500, "11- Notif Order Complate"], "isController": false}, {"data": [0.0, 500, 1500, "2-1 Click on Category"], "isController": false}, {"data": [1.0, 500, 1500, "7-1 Shipping address"], "isController": false}, {"data": [1.0, 500, 1500, "3-1 Input Username & Password-0"], "isController": false}, {"data": [1.0, 500, 1500, "4-1 Click on Shopping cart"], "isController": false}, {"data": [0.0, 500, 1500, "Open Url"], "isController": true}, {"data": [0.5, 500, 1500, "3-1 Input Username & Password"], "isController": false}, {"data": [0.5, 500, 1500, "Click on Checkout"], "isController": true}, {"data": [0.0, 500, 1500, "1-1 Open URL"], "isController": false}, {"data": [0.5, 500, 1500, "8-1 Shipping method and Click on Continue"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 21, 1, 4.761904761904762, 762.6190476190477, 234, 3101, 423.0, 2428.000000000001, 3065.0999999999995, 3101.0, 0.018208539805168625, 0.08640250194007655, 0.02287837318619099], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Shipping method and Click on Continue", 1, 0, 0.0, 1000.0, 1000, 1000, 1000.0, 1000.0, 1000.0, 1000.0, 1.0, 0.56640625, 1.1494140625], "isController": true}, {"data": ["Billing Address and Clik Continue", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 2.044787906137184, 5.690151173285198], "isController": true}, {"data": ["12-1 Order Detail", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 11.864941991017965, 2.1051646706586826], "isController": false}, {"data": ["2-1 Click on Log in", 1, 0, 0.0, 290.0, 290, 290, 290.0, 290.0, 290.0, 290.0, 3.4482758620689653, 20.69975754310345, 2.6198814655172415], "isController": false}, {"data": ["Click on Shopping cart", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 10.841459810874705, 2.4125480200945626], "isController": true}, {"data": ["Confirm Order", 1, 0, 0.0, 1317.0, 1317, 1317, 1317.0, 1317.0, 1317.0, 1317.0, 0.7593014426727411, 4.05232654707669, 1.629087177296887], "isController": true}, {"data": ["3-2 Clik login", 1, 0, 0.0, 354.0, 354, 354, 354.0, 354.0, 354.0, 354.0, 2.824858757062147, 22.10507150423729, 2.885549081920904], "isController": false}, {"data": ["5-1 Click on Checkout-0", 1, 0, 0.0, 879.0, 879, 879, 879.0, 879.0, 879.0, 879.0, 1.1376564277588168, 0.5654952360637088, 2.3497493600682593], "isController": false}, {"data": ["5-1 Click on Checkout-1", 1, 0, 0.0, 293.0, 293, 293, 293.0, 293.0, 293.0, 293.0, 3.4129692832764507, 15.651663822525599, 3.6396117747440275], "isController": false}, {"data": ["Order Detail", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 11.864941991017965, 2.1051646706586826], "isController": true}, {"data": ["6-1 Billing Address and Click on Continue", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 2.044787906137184, 5.690151173285198], "isController": false}, {"data": ["Click on Category", 1, 0, 0.0, 3101.0, 3101, 3101, 3101.0, 3101.0, 3101.0, 3101.0, 0.32247662044501774, 1.8397543131247984, 0.3051560988390842], "isController": true}, {"data": ["7-2  Click on Continue", 1, 0, 0.0, 301.0, 301, 301, 301.0, 301.0, 301.0, 301.0, 3.3222591362126246, 20.352081602990033, 3.455279277408638], "isController": false}, {"data": ["9-1 9-1 Paymen Information and Click on Continue", 1, 0, 0.0, 628.0, 628, 628, 628.0, 628.0, 628.0, 628.0, 1.5923566878980893, 0.9019207802547771, 1.7494153065286624], "isController": false}, {"data": ["Shipping address and Click on Continue", 1, 0, 0.0, 535.0, 535, 535, 535.0, 535.0, 535.0, 535.0, 1.8691588785046729, 12.509126752336448, 4.829877336448598], "isController": true}, {"data": ["Input Username & Password and clik login", 1, 0, 0.0, 1011.0, 1011, 1011, 1011.0, 1011.0, 1011.0, 1011.0, 0.9891196834817012, 16.28956478733927, 2.9934393545994067], "isController": true}, {"data": ["5-1 Click on Checkout", 1, 0, 0.0, 1172.0, 1172, 1172, 1172.0, 1172.0, 1172.0, 1172.0, 0.8532423208191127, 4.337037382679181, 2.6722149637372015], "isController": false}, {"data": ["Click on Product", 1, 1, 100.0, 313.0, 313, 313, 313.0, 313.0, 313.0, 313.0, 3.1948881789137378, 63.0335213658147, 3.0388877795527156], "isController": true}, {"data": ["Paymen method and Clik on Continue", 1, 0, 0.0, 882.0, 882, 882, 882.0, 882.0, 882.0, 882.0, 1.1337868480725624, 0.6421839569160998, 1.2899039824263039], "isController": true}, {"data": ["9-1 Paymen method and Clik on Continue", 1, 0, 0.0, 882.0, 882, 882, 882.0, 882.0, 882.0, 882.0, 1.1337868480725624, 0.6421839569160998, 1.2899039824263039], "isController": false}, {"data": ["11-1 Click Confirm", 1, 0, 0.0, 938.0, 938, 938, 938.0, 938.0, 938.0, 938.0, 1.0660980810234542, 0.6038446162046909, 1.168126998933902], "isController": false}, {"data": ["Click on Log in", 1, 0, 0.0, 290.0, 290, 290, 290.0, 290.0, 290.0, 290.0, 3.4482758620689653, 20.69975754310345, 2.6198814655172415], "isController": true}, {"data": ["Paymen Information", 1, 0, 0.0, 628.0, 628, 628, 628.0, 628.0, 628.0, 628.0, 1.5923566878980893, 0.9019207802547771, 1.7494153065286624], "isController": true}, {"data": ["2-2 Click On Product", 1, 1, 100.0, 313.0, 313, 313, 313.0, 313.0, 313.0, 313.0, 3.1948881789137378, 63.0335213658147, 3.0388877795527156], "isController": false}, {"data": ["3-1 Input Username & Password-1", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 19.96223294005102, 2.835020727040816], "isController": false}, {"data": ["11- Notif Order Complate", 1, 0, 0.0, 379.0, 379, 379, 379.0, 379.0, 379.0, 379.0, 2.638522427440633, 12.587091853562006, 2.7699332124010554], "isController": false}, {"data": ["2-1 Click on Category", 1, 0, 0.0, 3101.0, 3101, 3101, 3101.0, 3101.0, 3101.0, 3101.0, 0.32247662044501774, 1.8397543131247984, 0.3051560988390842], "isController": false}, {"data": ["7-1 Shipping address", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 2.42053952991453, 6.5980568910256405], "isController": false}, {"data": ["3-1 Input Username & Password-0", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 3.1596887065637063, 3.4500180984555984], "isController": false}, {"data": ["4-1 Click on Shopping cart", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 10.841459810874705, 2.4125480200945626], "isController": false}, {"data": ["Open Url", 1, 0, 0.0, 2742.0, 2742, 2742, 2742.0, 2742.0, 2742.0, 2742.0, 0.36469730123997085, 2.956754877826404, 0.2432502507293946], "isController": true}, {"data": ["3-1 Input Username & Password", 1, 0, 0.0, 657.0, 657, 657, 657.0, 657.0, 657.0, 657.0, 1.5220700152207, 13.156095414764078, 3.051572012937595], "isController": false}, {"data": ["Click on Checkout", 1, 0, 0.0, 1172.0, 1172, 1172, 1172.0, 1172.0, 1172.0, 1172.0, 0.8532423208191127, 4.337037382679181, 2.6722149637372015], "isController": true}, {"data": ["1-1 Open URL", 1, 0, 0.0, 2742.0, 2742, 2742, 2742.0, 2742.0, 2742.0, 2742.0, 0.36469730123997085, 2.956754877826404, 0.2432502507293946], "isController": false}, {"data": ["8-1 Shipping method and Click on Continue", 1, 0, 0.0, 1000.0, 1000, 1000, 1000.0, 1000.0, 1000.0, 1000.0, 1.0, 0.56640625, 1.1494140625], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["404/Not Found", 1, 100.0, 4.761904761904762], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 21, 1, "404/Not Found", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["2-2 Click On Product", 1, 1, "404/Not Found", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
