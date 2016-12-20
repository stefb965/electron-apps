const fs = require('fs')
const path = require('path')
const yaml = require('yamljs')
const getImageColors = require('get-image-colors')
const apps = []

fs.readdirSync(path.join(__dirname, 'apps'))
.filter(filename => {
  return fs.statSync(path.join(__dirname, `/apps/${filename}`)).isDirectory()
})
.forEach(slug => {
  const yamlFile = path.join(__dirname, `apps/${slug}/${slug}.yml`)
  const app = Object.assign(
    {slug: slug},
    yaml.load(yamlFile),
    {icon: `${slug}-icon.png`}
  )
  apps.push(app)
})

Promise.all(
  apps.map(app => {
    const filename = path.join(__dirname, `apps/${app.slug}/${app.icon}`)
    return getImageColors(filename).then(colors => {
      console.log(app.slug)
      return Object.assign(app, {iconColors: colors.map(color => color.hex())})
    })
  })
)
.then(apps => {
  fs.writeFileSync(
    path.join(__dirname, 'index.json'),
    JSON.stringify(apps, null, 2)
  )
})
.catch(error => {
  console.error(error)
})
