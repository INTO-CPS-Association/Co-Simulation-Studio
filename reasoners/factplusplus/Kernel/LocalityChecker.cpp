/* This file is part of the FaCT++ DL reasoner
Copyright (C) 2014-2015 Dmitry Tsarkov and The University of Manchester
Copyright (C) 2015-2017 Dmitry Tsarkov

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public
License along with this library; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
*/

// locality checking
#include "SemanticLocalityChecker.h"
#include "SyntacticLocalityChecker.h"
#include "ExtendedSyntacticLocalityChecker.h"

/// @return a locality checker corresponding to a given method
LocalityChecker* createLocalityChecker ( ModuleMethod moduleMethod, TSignature* pSig )
{
	switch ( moduleMethod )
	{
	case SYN_LOC_STD: return new SyntacticLocalityChecker(pSig);
	case SYN_LOC_COUNT: return new ExtendedSyntacticLocalityChecker(pSig);
	case SEM_LOC: return new SemanticLocalityChecker(pSig);
	default: fpp_unreachable();
	}
}
