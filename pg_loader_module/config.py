import json
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent


def load_config(file_name="pg_loader.json"):
    """Загружает и валидирует json конфигурацию."""
    config_path = BASE_DIR/'input'/file_name

    with open(config_path, 'r', encoding="utf-8") as f:
        cfg = json.load(f)

        for k in ["database", "load", "weights"]:
            if k not in cfg:
                raise KeyError(f"Отсутствует значение: {k}")

    return cfg


if __name__ == "__main__":
    config = load_config()
    print(
        f"Тест загружен успешно, номер загруженного теста: {load_config.__get__.__name__}")
