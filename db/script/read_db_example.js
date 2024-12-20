const { Low } = require('lowdb')
const { JSONFile } = require('lowdb/node')

// 创建数据库实例
async function createDb(filename) {
    const adapter = new JSONFile(`db/${filename}.json`)
    const db = new Low(adapter)
    await db.read()
    return db
}

async function main() {
    try {
        // 读取items数据库
        const itemsDb = await createDb('items')
        console.log('Items总数:', itemsDb.data.items.length)
        console.log('第一条item数据:', itemsDb.data.items[0])

        // 读取item_types数据库
        const itemTypesDb = await createDb('item_types')
        console.log('\nItem Types总数:', itemTypesDb.data.item_types.length)
        console.log('第一条item_type数据:', itemTypesDb.data.item_types[0])

        // 读取item_type_collections数据库
        const collectionsDb = await createDb('item_type_collections')
        console.log('\nCollections总数:', collectionsDb.data.item_type_collections.length)
        console.log('第一条collection数据:', collectionsDb.data.item_type_collections[0])

        // 示例：查询特定数据
        const searchExample = itemsDb.data.items.find(item => item._id === '你的ID') // 替换为实际ID
        if (searchExample) {
            console.log('\n查询结果:', searchExample)
        }

    } catch (error) {
        console.error('发生错误:', error)
    }
}

main() 