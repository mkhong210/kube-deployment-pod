// app.js

// 데이터 저장 
let deploymentData = [];
let podsData = [];

let	queryIndex = null;

function getQueryParams() {
	// URL에서 쿼리 파라미터
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	
	// 쿼리 파라미터 num 값
	const num = urlParams.get('num');

	queryIndex = num;
}


window.onload = function() {
	getQueryParams();

	// 페이지 초기화 및 데이터 호출
	if(queryIndex === null){
		fetchData();
		fetchPodData("deployment");
	} else {
		fetchPodData("pod");
	}
}

// deployment 데이터 호출 함수
async function fetchData() {
	const apiUrl = 'http://127.0.0.1:5001/k8s/apis/apps/v1/namespaces/default/deployments';
	// const apiUrl = 'http://127.0.0.1:5001/k8s/apis/apps/v1/namespaces/kube-system/deployments';
	const token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6Im9GQVR6alV5QlZHamMtNTZqNkdWM2VVZkJwc2xCYU12VmlqcEJqbnZkOUUifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlLXN5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJhZG1pbi11c2VyLXRva2VuLWx0NHd2Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQubmFtZSI6ImFkbWluLXVzZXIiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiI5ZmM1Nzk2NS05YzU1LTQ4YjQtOGZhOC0wZjRiMzU3ZGUwZDciLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6a3ViZS1zeXN0ZW06YWRtaW4tdXNlciJ9.aJGF-FlP5ZB_4KSVx-pC-UkKsznGqmmm7WtbL4NRFoT5VnTvaz_PT_u7AAG4dAp4EFbejPxpdixK1wVaJs5pAg5RIDHyrcU9AZgfpVIxPpvwiHf8-keociroPJSy4Mue80Z4N5u-wf5PjyzxYwxxy9tzb0lPBysDdAIfh1L-2jBQdatmTczzix4kc_e3oanobXGWPLVAhyI8J7mI7oBg_iEMbwVsMrG2FDuZGmqOg67W-npsi8Br1HIaIQ2uOKtzSGwVdN6q9yksbSLvocQm-J6CxNh9FKq_AtFTSBLW-60CoZSnpKUuKq4Za5tocE4tPjNCPHJesJIb_5_7IVQ5lQ'; // Be very cautious with token security

	// let url = `${apiUrl}?limit=${limit}`;

	try {
		const response = await fetch(apiUrl, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Accept': 'application/json'
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		// document.getElementById('output2').textContent = JSON.stringify(data, null, 2);
		// displayData(data.items); // 데이터 함수

		// console.log(data)
		deploymentData = data.items[0];

		// console.log(deploymentData)
		displayDeployment(deploymentData);
	
	} catch (error) {
		console.error('Fetch error:', error);
		document.getElementById('output2').textContent = 'Error fetching data';
	}
}

// deployment 데이터 출력
function displayDeployment(deploymentData){
	// 필요한 정보 추출
	let deploymentName = deploymentData.metadata.name;
	let namespace = deploymentData.metadata.namespace;
	let replicas = deploymentData.status.replicas;
	let availableReplicas = deploymentData.status.availableReplicas;
	let image = deploymentData.spec.template.spec.containers[0].image;
	let labels = deploymentData.spec.selector.matchLabels;
	labels = labels ? Object.keys(labels).map(key => `${key}: ${labels[key]}`).join(', ') : '';
	let annotations = deploymentData.metadata.annotations['deployment.kubernetes.io/revision']
	
	const deploymentDesc = document.getElementById('deploymentInfo');
	// const deploymentDesc = document.querySelector('#deploymentInfo');

	// HTML에 정보 추가
	if (deploymentDesc) {
		deploymentDesc.innerHTML = `
			<p><strong>Name :</strong> ${deploymentName}</p>
			<p><strong>Namespace :</strong> ${namespace}</p>
				<div class="flex flex-wrap gap-4">
					<p><strong>Image :</strong> ${image}</p>
					<p><strong>Labels :</strong> ${labels}</p>
					<p><strong>Replicas :</strong> ${replicas}</p>
					<p><strong>Available :</strong> ${availableReplicas}</p>
					<p><strong>Annotations :</strong> ${annotations}</p>
				</div>

			`;
	} else {
			console.error("Element with id 'deploymentInfo' not found.");
	}
}

// pods 데이터 호출 함수
async function fetchPodData(direction) {
	const prevBtn = document.getElementById('prevBtn');
	const nextBtn = document.getElementById('nextBtn');
	const apiUrl = 'http://127.0.0.1:5001/k8s/api/v1/namespaces/default/pods';
	// const apiUrl = 'http://127.0.0.1:5001/k8s/api/v1/namespaces/kube-system/pods';
	const token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6Im9GQVR6alV5QlZHamMtNTZqNkdWM2VVZkJwc2xCYU12VmlqcEJqbnZkOUUifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlLXN5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJhZG1pbi11c2VyLXRva2VuLWx0NHd2Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQubmFtZSI6ImFkbWluLXVzZXIiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiI5ZmM1Nzk2NS05YzU1LTQ4YjQtOGZhOC0wZjRiMzU3ZGUwZDciLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6a3ViZS1zeXN0ZW06YWRtaW4tdXNlciJ9.aJGF-FlP5ZB_4KSVx-pC-UkKsznGqmmm7WtbL4NRFoT5VnTvaz_PT_u7AAG4dAp4EFbejPxpdixK1wVaJs5pAg5RIDHyrcU9AZgfpVIxPpvwiHf8-keociroPJSy4Mue80Z4N5u-wf5PjyzxYwxxy9tzb0lPBysDdAIfh1L-2jBQdatmTczzix4kc_e3oanobXGWPLVAhyI8J7mI7oBg_iEMbwVsMrG2FDuZGmqOg67W-npsi8Br1HIaIQ2uOKtzSGwVdN6q9yksbSLvocQm-J6CxNh9FKq_AtFTSBLW-60CoZSnpKUuKq4Za5tocE4tPjNCPHJesJIb_5_7IVQ5lQ'; // Be very cautious with token security

	// let url = `${apiUrl}?limit=${limit}`;
	
	try {
		const response = await fetch(apiUrl, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Accept': 'application/json'
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		// document.getElementById('output2').textContent = JSON.stringify(data, null, 2);
		// displayData(data.items); // 데이터 함수

		podsData = data.items;

		// console.log(podsData)
		if(direction === "deployment"){
			displayData(podsData)
		} else if (direction === "pod") {
			displayPodDetailData(podsData);
		}
		
	
	} catch (error) {
		console.error('Fetch error:', error);
		document.getElementById('output2').textContent = 'Error fetching data';
	}
}

// 테이블 출력 
function tableCell(text){
	const cell = document.createElement('td');
	cell.textContent = text;
	return cell;
}

// 데이터 테이블에 출력
function displayData(podsData) {
	const tableBodies = document.getElementsByClassName('podsTable');
	// console.log(podsData)

	for (let i = 0; i < tableBodies.length; i++) {
		const tableBody = tableBodies[i];
		tableBody.innerHTML = '';
		// console.log(tableBody)

		podsData.forEach((podData, index) => {
			const row = document.createElement('tr');

			row.classList.add('cursor-pointer', 'bg-gray-100', 'hover:bg-gray-200');
			// row.classList.add('bg-violet-500', 'hover:bg-violet-600');
			
			// console.log(index)
			row.addEventListener('click', function() {
				index++;
        // 데이터를 URL 쿼리 문자열에 추가하여 디테일 페이지로 이동
				const queryString = `pod_detail.html?num=${index}`;
				window.location.href = './page/' + queryString;
			});

			// Phase(state)
			row.appendChild(tableCell(podData.status.phase));

			// Name
			row.appendChild(tableCell(podData.metadata.name));

			// Labels
			const labelsText = podData.metadata.labels ? Object.keys(podData.metadata.labels).map(key => `${key}: ${podData.metadata.labels[key]}`).join(', ') : '';
			row.appendChild(tableCell(labelsText));

			// Image
			const imageUrl = podData.spec.containers[0].image;
			row.appendChild(tableCell(imageUrl));

			// Ready
			const readyStatus = podData.status.conditions[1].status;
			row.appendChild(tableCell(readyStatus));

			// IP
			row.appendChild(tableCell(podData.status.podIP));
			

			tableBody.appendChild(row);
		});
	}
}

// pod detail 페이지 출력 
function displayPodDetailData(podData) {
	queryIndex--; 
	let detailData = podData[queryIndex];

	// 필요한 정보 추출
	let podName = detailData.metadata.name;
	let namespace = detailData.metadata.namespace;
	let podIP = detailData.status.podIP;
	let labels = detailData.metadata.labels;
	labels = labels ? Object.keys(labels).map(key => `${key}: ${labels[key]}`).join(', ') : '';
	let phase = detailData.status.phase;
	
	const podDetailDesc = document.getElementById('podInfo');
	// const deploymentDesc = document.querySelector('#deploymentInfo');

	displayPodtable(detailData)

	// HTML에 정보 추가
	if (podDetailDesc) {
		podDetailDesc.innerHTML = `
			<p class="text-2xl">${podName}</p>
			<p><strong>Namespace:</strong> ${namespace}</p>
				<div class="flex flex-wrap gap-4">
					<p><strong>podIP :</strong> ${podIP}</p>
					<p><strong>Labels :</strong> ${labels}</p>
					<p><strong>${phase}</strong></p>
				</div>
			`;
	} else {
			console.error("Element with id 'podInfo' not found.");
	}
}

// pod detail table 출력
function displayPodtable(tableData){
	console.log(tableData)
	const tableBodies = document.getElementsByClassName('containersTable');
	console.log(tableData)

	let detailTable = tableData.spec.containers;
	let detailphase = tableData.status.phase;


	for (let i = 0; i < tableBodies.length; i++) {
		const tableBody = tableBodies[i];
		tableBody.innerHTML = '';
		console.log(tableBody)

		detailTable.forEach(containerData => {
			const row = document.createElement('tr');
			
			// Phase(state)
			row.appendChild(tableCell(detailphase));

			// Ready
			// const readyStatus = containerData.status.conditions[1].status;
			// row.appendChild(tableCell(readyStatus));

			// Name
			row.appendChild(tableCell(containerData.name));

			// Image
			row.appendChild(tableCell(containerData.image));

			tableBody.appendChild(row);
		});
	}
}