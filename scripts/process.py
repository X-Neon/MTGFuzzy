import json
import requests
from typing import List
import sys


def get_card_image_uris(card: dict) -> List[str]:
    if "image_uris" in card:
        return [card["image_uris"]["normal"]]

    if "card_faces" in card:
        return [f["image_uris"]["normal"] for f in card["card_faces"]]

    raise RuntimeError("No card image")


def is_legal(card: dict) -> bool:
    if card["oversized"] or "legalities" not in card:
        return False

    return any((l == "legal" for l in card["legalities"].values()))

def main() -> None:
    bulk_data = requests.get("https://api.scryfall.com/bulk-data/oracle-cards").json()
    card_uri = bulk_data["download_uri"]
    cards = requests.get(card_uri).json()

    legal_cards = [c for c in cards if is_legal(c)]
    names = [{"name": c["name"], "uri": c["scryfall_uri"], "image": get_card_image_uris(c)} for c in legal_cards]

    with open(sys.argv[1], "w") as f:
        json.dump(names, f)


if __name__ == "__main__":
    main()