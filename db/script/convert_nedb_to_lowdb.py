import os
import json

def convert_nedb_to_lowdb(nedb_file_path):
    # 读取nedb文件并解析数据
    data = []
    with open(nedb_file_path, 'r', encoding='utf-8') as f:
        for line in f:
            if line.strip():  # 跳过空行
                try:
                    item = json.loads(line.strip())
                    data.append(item)
                except json.JSONDecodeError as e:
                    print(f"Error parsing line in {nedb_file_path}: {e}")
                    continue

    # 创建lowdb格式的数据
    collection_name = os.path.splitext(os.path.basename(nedb_file_path))[0]
    lowdb_data = {collection_name: data}

    # 创建输出文件名
    output_file = os.path.join(
        os.path.dirname(nedb_file_path),
        f"{collection_name}.json"
    )

    # 写入JSON文件
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(lowdb_data, f, ensure_ascii=False, indent=2)

    return output_file

def main():
    # 指定db目录
    db_dir = "db"
    
    # 处理所有nedb文件
    for filename in os.listdir(db_dir):
        if filename.endswith('.nedb'):
            nedb_path = os.path.join(db_dir, filename)
            output_file = convert_nedb_to_lowdb(nedb_path)
            print(f"Converted {filename} to {os.path.basename(output_file)}")

if __name__ == "__main__":
    main() 