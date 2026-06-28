<script>
	let { code } = $props();

	let iframeHtml = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">

<style>
body {
	margin: 0;
	overflow: hidden;
}
canvas {
	display: block;
}
</style>

<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.4/p5.min.js"><\/script>
</head>
<body>
<script>
${code ?? ''}
<\/script>
</body>
</html>
`;
</script>

<iframe
	title="P5 Sketch"
	srcdoc={iframeHtml}
	sandbox="allow-scripts"
	style="width:100%; height:800px; border:none;"
></iframe>