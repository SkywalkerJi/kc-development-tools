import json

def convert_pool_to_lowdb():
    # 读取原始pool.json文件
    with open('data/pool.json', 'r', encoding='utf-8') as f:
        pool_data = json.load(f)

    # 转换为lowdb格式
    lowdb_data = {
        "pool": pool_data
    }

    # 写入新的JSON文件
    output_file = 'data/pool_lowdb.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(lowdb_data, f, ensure_ascii=False, indent=2)

    print(f"转换完成，已保存到 {output_file}")

if __name__ == "__main__":
    convert_pool_to_lowdb() 