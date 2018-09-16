import org.dozer.DozerConverter;

public class pepe extends DozerConverter<Boolean, String> {
	public BooleanConverter() {
		super(Boolean.class, String.class);
	}

	@Override
	public Boolean convertFrom(String paramB, Boolean paramA) {
		if ("YES".equalsIgnoreCase(paramB)) {
			return Boolean.TRUE;
		}
		return Boolean.FALSE;
	}

	@Override
	public String convertTo(Boolean paramA, String paramB) {
		if (paramA != null && paramA.equals(Boolean.TRUE)) {
			return "YES";
		}
		return "NO";
	}
}