from config import load_config
from load_generator import run_k6_test


def main():
    print("запушен pg_loader_module")

    conf = load_config('tpc_b_max_tps.json')

    run_k6_test()


if __name__ == "__main__":
    main()
