self.addEventListener('install', e => {
    console.log('sw install');
})

self.addEventListener('activate', e =>{
    console.log('activate')
})

self.addEventListener('fetch', e => {
    console.log('sw fetch')
})