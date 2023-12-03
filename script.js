document.addEventListener('DOMContentLoaded', () => {
    const girl = document.getElementById('girl');
    const akiRect = document.getElementById('aki').getBoundingClientRect();
    const akiCenterX = akiRect.left + akiRect.width / 2;
    const akiCenterY = akiRect.top + akiRect.height / 2;

    girl.onmousedown = function(event) {
        event.preventDefault();
        let shiftX = event.clientX - girl.getBoundingClientRect().left;
        let shiftY = event.clientY - girl.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            let newLeft = Math.max(0, Math.min(pageX - shiftX, window.innerWidth - girl.offsetWidth));
            let newTop = Math.max(0, Math.min(pageY - shiftY, window.innerHeight - girl.offsetHeight));
            girl.style.left = newLeft + 'px';
            girl.style.top = newTop + 'px';
            updateMetrics(newLeft + girl.offsetWidth / 2, newTop + girl.offsetHeight / 2);
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
        };
    };

    girl.ondragstart = function() {
        return false;
    };

    function updateMetrics(girlCenterX, girlCenterY) {
        // Calculate overall distance from the center of AKI to the center of the girl
        const distanceX = girlCenterX - akiCenterX;
        const distanceY = girlCenterY - akiCenterY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        
        // Calculate the maximum possible distance from AKI (from center to corner of the window)
        const maxDistanceX = Math.max(akiCenterX, window.innerWidth - akiCenterX);
        const maxDistanceY = Math.max(akiCenterY, window.innerHeight - akiCenterY);
        const maxDistance = Math.sqrt(maxDistanceX * maxDistanceX + maxDistanceY * maxDistanceY);
        
        // Calculate proximity on a scale of 0 to 1, where 1 is very close and 0 is far away
        const proximity = Math.max(0, Math.min(1, (maxDistance - distance) / maxDistance));

        // Set metric values based on proximity (inverted for some)
        setMetric('heart', proximity * 100);
        setMetric('brain', (1 - proximity) * 100);
        setMetric('smile', proximity * 100);
        setMetric('stress', (1 - proximity) * 100);
        setMetric('happiness', proximity * 100);
        setMetric('voice', (1 - proximity) * 100);
        if (distance < 100) { // Threshold for change
            stateValue.innerText = 'Happy but Stupid';
            stateImage.src = 'happy.png';
            stateImage.style.display = 'inline';
        } else {
            stateValue.innerText = 'Sad but Intelligent';
            stateImage.src = 'sad.png';
            stateImage.style.display = 'inline';
        }
    }

    function setMetric(metricId, value) {
        const metricPercent = document.getElementById(metricId + 'Percent');
        const metricFill = document.getElementById(metricId + 'Fill');
        metricPercent.textContent = value.toFixed(0) + '%';
        metricFill.style.width = value.toFixed(0) + '%';
    }
});
