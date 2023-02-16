/**
 * File:     FragmentBreakdownType.java
 * Package:  de.uniwuerzburg.zpd.tlh.parser.core.data.fragment
 * 
 * Author:   Herbert Baier (herbert.baier@uni-wuerzburg.de)
 * Date:     16.02.2023
 */

import { java, S } from "../../../../../../../../../../usr/bin/java";


 class  FragmentBreakdownType extends java.lang.Enum<FragmentBreakdownType> {
	public static readonly Determinative: FragmentBreakdownType = new class extends FragmentBreakdownType {
}(S`Determinative`, 0); public static readonly Glossing: FragmentBreakdownType = new class extends FragmentBreakdownType {
}(S`Glossing`, 1); public static readonly UndefinedDegreeSign: FragmentBreakdownType = new class extends FragmentBreakdownType {
}(S`UndefinedDegreeSign`, 2);

	public static readonly Delimiter: FragmentBreakdownType = new class extends FragmentBreakdownType {
}(S`Delimiter`, 3);

	public static readonly Number: FragmentBreakdownType = new class extends FragmentBreakdownType {
}(S`Number`, 4);

	public static readonly Basic: FragmentBreakdownType = new class extends FragmentBreakdownType {
}(S`Basic`, 5); public static readonly Akkadogram: FragmentBreakdownType = new class extends FragmentBreakdownType {
}(S`Akkadogram`, 6); public static readonly Sumerogram: FragmentBreakdownType = new class extends FragmentBreakdownType {
}(S`Sumerogram`, 7);

	public static readonly NotImplemented: FragmentBreakdownType = new class extends FragmentBreakdownType {
}(S`NotImplemented`, 8)
}
