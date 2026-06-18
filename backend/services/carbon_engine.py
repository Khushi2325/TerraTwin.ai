class CarbonEngine:
    TRANSPORT_FACTORS = {
        "walking": 0.0,
        "bicycle": 0.0,
        "bus": 0.089,
        "train": 0.041,
        "car": 0.192,
        "flight": 0.255
    }

    FOOD_FACTORS = {
        "vegan": 1.0,
        "vegetarian": 1.5,
        "mixed": 2.5,
        "meat_heavy": 5.0
    }

    ELECTRICITY_FACTOR = 0.82 # per kWh

    @staticmethod
    def calculate_transport_emissions(mode: str, distance_km: float) -> float:
        factor = CarbonEngine.TRANSPORT_FACTORS.get(mode.lower(), 0.0)
        return factor * distance_km

    @staticmethod
    def calculate_food_emissions(diet_type: str, meals: int) -> float:
        factor = CarbonEngine.FOOD_FACTORS.get(diet_type.lower(), 2.5) # default mixed
        return factor * meals

    @staticmethod
    def calculate_electricity_emissions(kwh: float) -> float:
        return CarbonEngine.ELECTRICITY_FACTOR * kwh

    @staticmethod
    def calculate_daily_total(transport_mode: str, distance_km: float, diet_type: str, meals: int, kwh: float) -> float:
        transport = CarbonEngine.calculate_transport_emissions(transport_mode, distance_km)
        food = CarbonEngine.calculate_food_emissions(diet_type, meals)
        electricity = CarbonEngine.calculate_electricity_emissions(kwh)
        return transport + food + electricity
