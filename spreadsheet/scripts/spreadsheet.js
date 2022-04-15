let studentGrades = { 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 };
let data = [];

function createTable(response) {
    let table = $('#spreadsheet')
    data = response.split("\n").map(element => element.split(","))
    console.log(data)
    for (let i = 0; i < data.length; i++) {
        let row = $(`<tr />`)
        for (let j = 0; j < data[0].length; j++) {
            if (i === 0 && j === 0)
                row.append($(`<th>/`).html(data[i][j]))
            else if (i === 0)
                row.append($(`<th class="colSel" id="${i}${j}" >/`).html(data[i][j]))
            else if (j === 0)
                row.append($(`<th class="rowSel" id="${i}${j}" >/`).html(data[i][j]))
            else if (data[i][j] <= 10.0)
                row.append($(`<td id="${i}${j}" >/`).html((data[i][j]*10.0).toFixed(1)))
            else 
            row.append($(`<td id="${i}${j}" >/`).html(data[i][j]))
        }
        table.append(row)
    }
}

function getGrade(mark) {
    if (mark < 50.0) {
        return 'F';
    } else if (mark < 60.0) {
        return 'D';
    } else if (mark < 70.0) {
        return 'C';
    } else if (mark < 80.0) {
        return 'B';
    } else {
        return 'A';
    }
}

function deselectAll() {
    $('td').removeClass()
}

function selectRow(row) {
    for (let i = 1; i < data.length; i++)
        $(`#${row}${i}`).addClass('highlight')
}

function selectColumn(col) {
    studentGrades = { 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 };
    for (let i = 1; i < data.length; i++) {
        let cell = $(`#${i}${col}`)
        cell.addClass('highlight')

        let grade = getGrade(cell.text())
        if (grade in studentGrades)
            studentGrades[grade] += 1;
        else
            studentGrades[grade] = 1;
    }
    console.log(studentGrades);
    histogram()
}


function histogram() {
    let gData = []
    for (const [key, value] of Object.entries(studentGrades)) {
        gData.push({
            letter: key,
            count: value / (data.length - 1)
        })
    }

    console.log(gData);

    const width = 800;
    const height = 500;
    const margin = 50;
    const chartWidth = width - 2 * margin; // 700
    const chartHeight = height - 2 * margin; // 400

    const colorScale = d3.scaleLinear()
        .domain([0, 0.3, 1.0])
        .range(['blue', 'purple', 'pink'])

    const xScale = d3.scaleBand() //discrete values
        .domain(gData.map((data) => data.letter))
        .range([0, chartWidth])
        .padding(0.5)

    const yScale = d3.scaleLinear() //continues
        .domain([0, 1])
        .range([chartHeight, 0])

    d3.select('svg').remove()
    let svg = d3.select('#gradeHistogram')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height - 10)
        .attr("text-anchor", 'middle')
        .text('Sales by Year')

    let graph = svg.append('g')
        .attr('transform', `translate(${margin},${margin})`);

    // add x axis
    graph.append('g')
        .attr('transform', `translate(0,${chartHeight})`)
        .call(d3.axisBottom(xScale));

    //add y axis
    graph.append('g')
        .call(d3.axisLeft(yScale));

    let rectangles = graph.selectAll('rect')
        .data(gData)
        .enter()
        .append('rect')
        .attr('x', (data) => xScale(data.letter))
        .attr('y', (data) => yScale(data.count))
        .attr("width", xScale.bandwidth())
        .attr("height", (data) => (chartHeight - yScale(data.count)))
        .attr('fill', (data) => colorScale(data.count))
}

$(document).ready(function () {
    $(document).on("click", ".rowSel", function (event) {
        deselectAll();
        selectRow(event.target.id[0]);
    });

    $(document).on("click", ".colSel", function (event) {
        deselectAll();
        selectColumn(event.target.id[1]);
    });

    $(document).on("click", "td", function () {
        deselectAll()
        let cell = $(this);
        cell.addClass('highlighted')
        let $input = $('<input />', {
            value: cell.text(),
            type: 'text',
            blur: function () {
                cell.text(this.value);
            },
            keyup: function (event) {
                if (event.which === 13)
                    $input.blur();
            }
        }).appendTo(cell.empty()).focus();
    });

    $.ajax({
        type: "GET",
        url: "grades.csv",
        dataType: "text",
        
    }).done(createTable)

});


