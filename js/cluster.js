// d3.js로 SVG 생성
const svg = d3.select("svg");

// 오리지널 클러스터
function drawOriginalCluster(cx, cy, clusterName) {
	// 클러스터를 표시하는 네모
	svg.append("rect")
	.attr("x", cx - 100)
	.attr("y", cy - 50)
	.attr("width", 200)
	.attr("height", 100)
	.attr("fill", "white")
	.attr("stroke", "black")
	.attr("stroke-width", 2);

	// 원
	svg.append("circle")
		.attr("cx", cx)
		.attr("cy", cy)
		.attr("r", 30)
		.attr("fill", "white")
		.attr("fill", "blue");

	// 원 아래에 글자
	svg.append("text")
		.attr("x", cx)
		.attr("y", cy + 40)
		.attr("text-anchor", "middle")
		.attr("alignment-baseline", "middle")
		.text(clusterName);
}

// 다른 클러스터
function drawOtherCluster(cx, cy, clusterName) {
	// 클러스터를 표시하는 네모
	svg.append("rect")
	.attr("x", cx - 90)
	.attr("y", cy - 50)
	.attr("width", 180)
	.attr("height", 100)
	.attr("fill", "white")
	.attr("stroke", "black")
	.attr("stroke-width", 2);

	// 원
	svg.append("circle")
		.attr("cx", cx)
		.attr("cy", cy)
		.attr("r", 30)
		.attr("fill", "white")
		.attr("fill", "lightblue");

	// 원 아래에 글자
	svg.append("text")
		.attr("x", cx)
		.attr("y", cy + 40)
		.attr("text-anchor", "middle")
		.attr("alignment-baseline", "middle")
		.text(clusterName);
}

// 클러스터
drawOriginalCluster(250, 100, "Original Cluster");
drawOtherCluster(150, 300, "Destination Cluster #1");
drawOtherCluster(350, 300, "Destination Cluster #2");

// 클러스터 간의 화살표 추가
svg.append("defs").append("marker")
    .attr("id", "arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 8)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("class","arrowHead");

svg.append("line")
		.attr("x1", 220)
		.attr("y1", 130)
		.attr("x2", 150)
		.attr("y2", 270)
		.attr("stroke", "black")
		.attr("marker-end", "url(#arrow)");

svg.append("line")
		.attr("x1", 280)
		.attr("y1", 130)
		.attr("x2", 350)
		.attr("y2", 270)
		.attr("stroke", "black")
		.attr("marker-end", "url(#arrow)");