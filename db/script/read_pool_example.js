const { Low } = require('lowdb')
const { JSONFile } = require('lowdb/node')

async function main() {
    try {
        // 创建数据库实例
        const adapter = new JSONFile('data/pool_lowdb.json')
        const db = new Low(adapter)
        await db.read()

        // 读取所有数据
        console.log('Pool总数:', db.data.pool.length)
        
        // 读取第一条数据
        console.log('\n第一条数据:', db.data.pool[0])

        // 示例：查询特定ID的数据
        const id = 25  // 示例ID
        const searchResult = db.data.pool.find(item => item.id === id)
        if (searchResult) {
            console.log(`\nID为 ${id} 的数据:`, searchResult)
        }

        // 示例：查询所有有gunFs值的数据
        const gunFsItems = db.data.pool.filter(item => item.gunFs)
        console.log(`\n有gunFs值的数据数量: ${gunFsItems.length}`)

    } catch (error) {
        console.error('发生错误:', error)
    }
}

main() 