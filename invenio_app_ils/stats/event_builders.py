import datetime
import json

from invenio_stats.proxies import current_stats

from invenio_app_ils.proxies import current_app_ils


def count_items(event):
    """Count available items."""
    event.update(
        {
            "timestamp": datetime.datetime.now().isoformat(),
            "available_items_count": current_app_ils.item_search_cls()
            .filter("term", status="CAN_CIRCULATE")
            .count(),
        }
    )

    return event


def process_periodic_stats(stat_names):
    """Process periodic stats."""
    for stat_name in stat_names:
        current_stats.publish(stat_name, [count_items({})])
