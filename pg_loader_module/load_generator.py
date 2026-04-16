import subprocess
import os


def run_k6_test():
    k6_path = "k6-with-sql"
    script_path = "/input/tpc_b_max_tps.js"
    print(f"запуск нагрузки k6 из {script_path}")

    result = subprocess.run([k6_path, "run", script_path], cwd="/input")

    if result.returncode == 0:
        print("тест завершился успешно")

    else:
        print(f"тест упал, причина - {result.returncode}")
