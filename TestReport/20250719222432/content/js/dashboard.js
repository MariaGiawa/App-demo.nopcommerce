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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7428571428571429, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "Shipping method and Click on Continue"], "isController": true}, {"data": [1.0, 500, 1500, "Billing Address and Clik Continue"], "isController": true}, {"data": [1.0, 500, 1500, "12-1 Order Detail"], "isController": false}, {"data": [1.0, 500, 1500, "2-1 Click on Log in"], "isController": false}, {"data": [1.0, 500, 1500, "Click on Shopping cart"], "isController": true}, {"data": [0.5, 500, 1500, "Confirm Order"], "isController": true}, {"data": [1.0, 500, 1500, "3-2 Clik login"], "isController": false}, {"data": [0.5, 500, 1500, "5-1 Click on Checkout-0"], "isController": false}, {"data": [1.0, 500, 1500, "5-1 Click on Checkout-1"], "isController": false}, {"data": [1.0, 500, 1500, "Order Detail"], "isController": true}, {"data": [1.0, 500, 1500, "6-1 Billing Address and Click on Continue"], "isController": false}, {"data": [1.0, 500, 1500, "Click on Category"], "isController": true}, {"data": [1.0, 500, 1500, "7-2  Click on Continue"], "isController": false}, {"data": [0.5, 500, 1500, "9-1 9-1 Paymen Information and Click on Continue"], "isController": false}, {"data": [0.5, 500, 1500, "Shipping address and Click on Continue"], "isController": true}, {"data": [0.5, 500, 1500, "Input Username & Password and clik login"], "isController": true}, {"data": [0.5, 500, 1500, "5-1 Click on Checkout"], "isController": false}, {"data": [0.5, 500, 1500, "Click on Product"], "isController": true}, {"data": [0.5, 500, 1500, "Paymen method and Clik on Continue"], "isController": true}, {"data": [0.5, 500, 1500, "9-1 Paymen method and Clik on Continue"], "isController": false}, {"data": [0.5, 500, 1500, "11-1 Click Confirm"], "isController": false}, {"data": [1.0, 500, 1500, "Click on Log in"], "isController": true}, {"data": [0.5, 500, 1500, "Paymen Information"], "isController": true}, {"data": [0.5, 500, 1500, "2-2 Click On Product"], "isController": false}, {"data": [1.0, 500, 1500, "3-1 Input Username & Password-1"], "isController": false}, {"data": [1.0, 500, 1500, "11- Notif Order Complate"], "isController": false}, {"data": [1.0, 500, 1500, "2-1 Click on Category"], "isController": false}, {"data": [1.0, 500, 1500, "7-1 Shipping address"], "isController": false}, {"data": [1.0, 500, 1500, "3-1 Input Username & Password-0"], "isController": false}, {"data": [1.0, 500, 1500, "4-1 Click on Shopping cart"], "isController": false}, {"data": [0.5, 500, 1500, "Open Url"], "isController": true}, {"data": [0.5, 500, 1500, "3-1 Input Username & Password"], "isController": false}, {"data": [0.5, 500, 1500, "Click on Checkout"], "isController": true}, {"data": [0.5, 500, 1500, "1-1 Open URL"], "isController": false}, {"data": [0.5, 500, 1500, "8-1 Shipping method and Click on Continue"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 21, 0, 0.0, 575.0952380952381, 223, 1416, 403.0, 1180.6000000000001, 1395.3999999999996, 1416.0, 0.018270163517963484, 0.07821913756128118, 0.023892079068482664], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Shipping method and Click on Continue", 1, 0, 0.0, 598.0, 598, 598, 598.0, 598.0, 598.0, 598.0, 1.6722408026755853, 0.9471676421404682, 2.0266121446488294], "isController": true}, {"data": ["Billing Address and Clik Continue", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 2.5399383408071747, 7.348304372197309], "isController": true}, {"data": ["12-1 Order Detail", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 13.856260926573427, 2.6041666666666665], "isController": false}, {"data": ["2-1 Click on Log in", 1, 0, 0.0, 330.0, 330, 330, 330.0, 330.0, 330.0, 330.0, 3.0303030303030303, 18.190696022727273, 2.491714015151515], "isController": false}, {"data": ["Click on Shopping cart", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 15.5984268707483, 3.6837000425170072], "isController": true}, {"data": ["Confirm Order", 1, 0, 0.0, 1053.0, 1053, 1053, 1053.0, 1053.0, 1053.0, 1053.0, 0.9496676163342831, 5.06829445631529, 2.1562277421652425], "isController": true}, {"data": ["3-2 Clik login", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 21.39774445564516, 2.913936491935484], "isController": false}, {"data": ["5-1 Click on Checkout-0", 1, 0, 0.0, 916.0, 916, 916, 916.0, 916.0, 916.0, 916.0, 1.0917030567685588, 0.5426531795851528, 2.227116880458515], "isController": false}, {"data": ["5-1 Click on Checkout-1", 1, 0, 0.0, 293.0, 293, 293, 293.0, 293.0, 293.0, 293.0, 3.4129692832764507, 15.651663822525599, 3.852922354948806], "isController": false}, {"data": ["Order Detail", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 13.856260926573427, 2.6041666666666665], "isController": true}, {"data": ["6-1 Billing Address and Click on Continue", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 2.5399383408071747, 7.348304372197309], "isController": false}, {"data": ["Click on Category", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 16.13145549007444, 2.3432653535980146], "isController": true}, {"data": ["7-2  Click on Continue", 1, 0, 0.0, 315.0, 315, 315, 315.0, 315.0, 315.0, 315.0, 3.1746031746031744, 19.447544642857142, 3.500124007936508], "isController": false}, {"data": ["9-1 9-1 Paymen Information and Click on Continue", 1, 0, 0.0, 855.0, 855, 855, 855.0, 855.0, 855.0, 855.0, 1.1695906432748537, 0.6624634502923977, 1.3580500730994152], "isController": false}, {"data": ["Shipping address and Click on Continue", 1, 0, 0.0, 543.0, 543, 543, 543.0, 543.0, 543.0, 543.0, 1.8416206261510129, 12.324830225598525, 4.98892150092081], "isController": true}, {"data": ["Input Username & Password and clik login", 1, 0, 0.0, 992.0, 992, 992, 992.0, 992.0, 992.0, 992.0, 1.0080645161290323, 16.873267389112904, 3.2397854712701615], "isController": true}, {"data": ["5-1 Click on Checkout", 1, 0, 0.0, 1210.0, 1210, 1210, 1210.0, 1210.0, 1210.0, 1210.0, 0.8264462809917356, 4.200832902892562, 2.6189630681818183], "isController": false}, {"data": ["Click on Product", 1, 0, 0.0, 1063.0, 1063, 1063, 1063.0, 1063.0, 1063.0, 1063.0, 0.9407337723424272, 8.266330550329258, 0.8984742474129822], "isController": true}, {"data": ["Paymen method and Clik on Continue", 1, 0, 0.0, 841.0, 841, 841, 841.0, 841.0, 841.0, 841.0, 1.1890606420927465, 0.6734913793103449, 1.4271050089179549], "isController": true}, {"data": ["9-1 Paymen method and Clik on Continue", 1, 0, 0.0, 841.0, 841, 841, 841.0, 841.0, 841.0, 841.0, 1.1890606420927465, 0.6734913793103449, 1.4271050089179549], "isController": false}, {"data": ["11-1 Click Confirm", 1, 0, 0.0, 731.0, 731, 731, 731.0, 731.0, 731.0, 731.0, 1.3679890560875512, 0.7748375512995896, 1.5844091997264023], "isController": false}, {"data": ["Click on Log in", 1, 0, 0.0, 330.0, 330, 330, 330.0, 330.0, 330.0, 330.0, 3.0303030303030303, 18.190696022727273, 2.491714015151515], "isController": true}, {"data": ["Paymen Information", 1, 0, 0.0, 855.0, 855, 855, 855.0, 855.0, 855.0, 855.0, 1.1695906432748537, 0.6624634502923977, 1.3580500730994152], "isController": true}, {"data": ["2-2 Click On Product", 1, 0, 0.0, 1063.0, 1063, 1063, 1063.0, 1063.0, 1063.0, 1063.0, 0.9407337723424272, 8.266330550329258, 0.8984742474129822], "isController": false}, {"data": ["3-1 Input Username & Password-1", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 20.892285925196852, 3.080913713910761], "isController": false}, {"data": ["11- Notif Order Complate", 1, 0, 0.0, 322.0, 322, 322, 322.0, 322.0, 322.0, 322.0, 3.105590062111801, 14.815241653726707, 3.4543623835403725], "isController": false}, {"data": ["2-1 Click on Category", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 16.13145549007444, 2.3432653535980146], "isController": false}, {"data": ["7-1 Shipping address", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 2.484237938596491, 7.0458127741228065], "isController": false}, {"data": ["3-1 Input Username & Password-0", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 3.4529931434599157, 4.033986023206751], "isController": false}, {"data": ["4-1 Click on Shopping cart", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 15.5984268707483, 3.6837000425170072], "isController": false}, {"data": ["Open Url", 1, 0, 0.0, 1416.0, 1416, 1416, 1416.0, 1416.0, 1416.0, 1416.0, 0.7062146892655368, 5.7255804201977405, 0.47103968043785316], "isController": true}, {"data": ["3-1 Input Username & Password", 1, 0, 0.0, 620.0, 620, 620, 620.0, 620.0, 620.0, 620.0, 1.6129032258064515, 14.158581149193548, 3.435294858870968], "isController": false}, {"data": ["Click on Checkout", 1, 0, 0.0, 1210.0, 1210, 1210, 1210.0, 1210.0, 1210.0, 1210.0, 0.8264462809917356, 4.200832902892562, 2.6189630681818183], "isController": true}, {"data": ["1-1 Open URL", 1, 0, 0.0, 1416.0, 1416, 1416, 1416.0, 1416.0, 1416.0, 1416.0, 0.7062146892655368, 5.7255804201977405, 0.47103968043785316], "isController": false}, {"data": ["8-1 Shipping method and Click on Continue", 1, 0, 0.0, 598.0, 598, 598, 598.0, 598.0, 598.0, 598.0, 1.6722408026755853, 0.9471676421404682, 2.0266121446488294], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 21, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
