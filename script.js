const canvas=document.getElementById('canvas')
// console.log(canvas)

const ctx=canvas.getContext('2d')
// console.log(ctx)


navigator.mediaDevices.getUserMedia({audio:true,video:false})
    .then((stream)=>{
        const audioctx= new (window.AudioContext || window.webkitAudioContext)();
        // console.log(audioctx)
        const source= audioctx.createMediaStreamSource(stream)

        const analyser = audioctx.createAnalyser()
        analyser.fftSize=256
        source.connect(analyser)

        const dataArray=new Uint8Array(analyser.frequencyBinCount)

        
        // console.log(canvas.width)

        function visualize(){
            
            analyser.getByteFrequencyData(dataArray)
            // console.log(dataArray)

            ctx.clearRect(0,0,canvas.width,canvas.height)

            let x=0
            let y=canvas.height

            bar_width=canvas.width/analyser.frequencyBinCount
            // console.log(bar_width)
            total_loudness=0
            for (let i = 0; i < dataArray.length; i++){
                bar_height=(dataArray[i]/255)*canvas.height
                y = canvas.height - bar_height
                
                let r=Math.floor((dataArray[i] / 255) * 255)
                let b=0
                let g= 255 -r
                ctx.fillStyle=`rgb(${r},${g},0)`

                // let gradient =ctx.createLinearGradient(x, y, x, y + bar_height)
                // gradient.addColorStop(1, "green");
                // gradient.addColorStop(0, "red");
                // ctx.fillStyle=gradient
                ctx.lineJoin = "round"
                ctx.fillRect(x,y,bar_width,bar_height)
                x+=bar_width

                total_loudness+=dataArray[i]
            }

            average=total_loudness/dataArray.length

            if (average>150){
                alert('get out')
            }

            x=0 
            requestAnimationFrame(visualize)
        }


        requestAnimationFrame(visualize)


    })
    .catch((err)=>{
        console.log(err)
    })