// ========================== Selectors / Variables ==========================

const card = document.querySelector('#card')
const hashRes = document.querySelector('#hashRes')
const selectedFile = document.querySelector('#inputFile')


// ========================== Events Listeners / Function Calls ==========================

selectedFile.addEventListener('change', () => {
    const file = selectedFile.files[0]

    readFileAndHashIt(file, hashRes)
})

hashRes.addEventListener('click', (e) => {
    if (![...e.target.classList].includes('cpyBtn')) return

    const hashVal = e.target.parentNode.parentNode.querySelector('.hashVal').innerText
    const fileName = e.target.parentNode.parentNode.querySelector('.fileName').innerText
    copyText(fileName, hashVal)
})


// ========================== Functions ==========================

function readFileAndHashIt(file, dest) {
    const fr = new FileReader()
    
    fr.onload = function () {
        const res = fr.result
        const t1 = performance.now()
        const hashValue = CryptoJS.MD5(res).toString()
        const t2 = performance.now()

        const executionTime = t2 - t1

        const card = createCard(file.name, hashValue, executionTime)

        dest.insertBefore(card, dest.firstChild)
    }
    
    fr.readAsText(file)
}

function createCard(fileName, hashValue, execTime) {
    const card = document.createElement('div')
    card.className = "bg-blue-50 p-3 sm:p-5 min-w-full max-w-2xl rounded-lg"

    const cardHTML = `
        <div class="flex items-center justify-between space-x-2 sm:space-x-4">
            <h2 class="font-bold max-w-xs sm:max-w-sm md:max-w-md truncate">
                <span class="text-sm sm:text-md text-blue-500 tracking-wide">Hash Value for</span>
                <br>
                <span class="fileName text-md text-blue-600 tracking-wider">
                    ${fileName}
                </span>
            </h2>

            <button aria-label="Copy Text" title="Copy hash value"
                class="cpyBtn text-blue-600 hover:text-blue-400">
                <svg class="w-6 sm:w-7 pointer-events-none" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="feather feather-copy">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
            </button>
        </div>
        <p
            class="mt-2 text-sm sm:text-md text-green-700 font-semibold max-w-xs sm:max-w-sm md:max-w-md truncate">
            Execution Time:
            <span>${execTime}</span>ms
        </p>
        <p
            class="hashVal mt-2 sm:mt-4 text-lg sm:text-xl max-w-xs sm:max-w-sm md:max-w-md font-bold tracking-wider truncate text-blue-900">
            ${hashValue}
        </p>
    `

    card.innerHTML = cardHTML

    return card
}

async function copyText(fileName, txt) {
    try {
        await navigator.clipboard.writeText(txt)
        alert(`Hash value for " ${fileName} " is Copied!!!`)
    } catch (err) {
        alert(`Failed To Copy: ${err}`)
    }
}