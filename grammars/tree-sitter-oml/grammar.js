/*
 * tree-sitter-oml
 * Copyright (C) 2023 Perpetual Labs, Ltd.
 */

/**
 * @author Mohamad Omar Nachawati <omar@perpetuallabs.io>
 */

module.exports = grammar({

  name: 'oml',

  extras: $ => [
    $.SL_COMMENT,
    $.ML_COMMENT,
    /\s/
  ],

  conflicts: $ => [
    [$._Ref, $.QualifiedName],
    [$.ConceptInstance]
  ],

  rules: {

    Ontology: $ => choice(
      field('Ontology', $.VocabularyBox),
      field('Ontology', $.DescriptionBox)
    ),

    VocabularyBox: $ => seq(
      repeat(field('ownedAnnotations', $.Annotation)),
      choice(
        field('VocabularyBox', $.Vocabulary),
        field('VocabularyBox', $.VocabularyBundle)
      )
    ),

    Vocabulary: $ => seq(
      'vocabulary', field('namespace', $.Namespace), 'as', field('prefix', $.LocalName), '{',
      repeat(field('ownedImports', $.VocabularyImport)),
      repeat(field('ownedStatements', $.VocabularyStatement)),
      '}'
    ),

    VocabularyBundle: $ => seq(
      'vocabulary', 'bundle', field('namespace', $.Namespace), 'as', field('prefix', $.LocalName), '{',
      repeat(field('ownedImports', $.VocabularyBundleImport)),
      '}'
    ),

    DescriptionBox: $ => seq(
      repeat(field('ownedAnnotations', $.Annotation)),
      choice(
        field('DescriptionBox', $.Description),
        field('DescriptionBox', $.DescriptionBundle)
      )
    ),

    Description: $ => seq(
      'description', field('namespace', $.Namespace), 'as', field('prefix', $.LocalName), '{',
      repeat(field('ownedImports', $.DescriptionImport)),
      repeat(field('ownedStatements', $.DescriptionStatement)),
      '}'
    ),

    DescriptionBundle: $ => seq(
      'description', 'bundle', field('namespace', $.Namespace), 'as', field('prefix', $.LocalName), '{',
      repeat(field('ownedImports', $.DescriptionBundleImport)),
      '}'
    ),

    VocabularyImport: $ => seq(
      repeat(field('ownedAnnotations', $.Annotation)),
      choice(
        field('VocabularyImport', $.VocabularyExtension),
        field('VocabularyImport', $.VocabularyUsage)
      )
    ),

    VocabularyExtension: $ => seq(
      'extends', field('namespace', $.Namespace), optional(seq('as', field('prefix', $.LocalName)))
    ),

    VocabularyUsage: $ => seq(
      'uses', field('namespace', $.Namespace), optional(seq('as', field('prefix', $.LocalName)))
    ),

    VocabularyBundleImport: $ => seq(
      repeat(field('ownedAnnotations', $.Annotation)),
      choice(
        field('VocabularyBundleImport', $.VocabularyBundleExtension),
        field('VocabularyBundleImport', $.VocabularyBundleInclusion)
      )
    ),

    VocabularyBundleInclusion: $ => seq(
      'includes', field('namespace', $.Namespace), optional(seq('as', field('prefix', $.LocalName)))
    ),

    VocabularyBundleExtension: $ => seq(
      'extends', field('namespace', $.Namespace), optional(seq('as', field('prefix', $.LocalName)))
    ),

    DescriptionImport: $ => seq(
      repeat(field('ownedAnnotations', $.Annotation)),
      choice(
        field('DescriptionImport', $.DescriptionExtension),
        field('DescriptionImport', $.DescriptionUsage)
      )
    ),

    DescriptionUsage: $ => seq(
      'uses', field('namespace', $.Namespace), optional(seq('as', field('prefix', $.LocalName)))
    ),

    DescriptionExtension: $ => seq(
      'extends', field('namespace', $.Namespace), optional(seq('as', field('prefix', $.LocalName)))
    ),

    DescriptionBundleImport: $ => seq(
      repeat(field('ownedAnnotations', $.Annotation)),
      choice(
        field('DescriptionBundleImport', $.DescriptionBundleExtension),
        field('DescriptionBundleImport', $.DescriptionBundleInclusion),
        field('DescriptionBundleImport', $.DescriptionBundleUsage)
      )
    ),

    DescriptionBundleInclusion: $ => seq(
      'includes', field('namespace', $.Namespace), optional(seq('as', field('prefix', $.LocalName)))
    ),

    DescriptionBundleExtension: $ => seq(
      'extends', field('namespace', $.Namespace), optional(seq('as', field('prefix', $.LocalName)))
    ),

    DescriptionBundleUsage: $ => seq(
      'uses', field('namespace', $.Namespace), optional(seq('as', field('prefix', $.LocalName)))
    ),

    VocabularyStatement: $ => seq(
      repeat(field('ownedAnnotations', $.Annotation)),
      choice(
        field('VocabularyStatement', $._SpecializableTerm),
        field('VocabularyStatement', $._SpecializableTermReference),
        field('VocabularyStatement', $.Rule),
        field('VocabularyStatement', $.RuleReference),
        field('VocabularyStatement', $.RelationReference)
      )
    ),

    _SpecializableTerm: $ => choice(
      $._Type,
      $.AnnotationProperty,
      $.ScalarProperty,
      $.StructuredProperty
    ),

    _Type: $ => choice(
      $._Classifier,
      $._Scalar
    ),

    _Classifier: $ => choice(
      $._Entity,
      $.Structure
    ),

    _Entity: $ => choice(
      $.Aspect,
      $.Concept,
      $.RelationEntity
    ),

    Aspect: $ => seq(
      'aspect', field('name', $.LocalName), optional(seq(':>', field('ownedSpecializations', $.SpecializationAxiom), repeat(seq(',', field('ownedSpecializations', $.SpecializationAxiom))))), optional(seq('[',
        repeat(choice(
          field('ownedKeys', $.KeyAxiom),
          field('ownedPropertyRestrictions', $._PropertyRestrictionAxiom),
          field('ownedRelationRestrictions', $._RelationRestrictionAxiom)
        )),
        ']'))
    ),

    Concept: $ => seq(
      'concept', field('name', $.LocalName), optional(seq(':>', field('ownedSpecializations', $.SpecializationAxiom), repeat(seq(',', field('ownedSpecializations', $.SpecializationAxiom))))), optional(seq('[',
        repeat(choice(
          field('ownedKeys', $.KeyAxiom),
          field('ownedPropertyRestrictions', $._PropertyRestrictionAxiom),
          field('ownedRelationRestrictions', $._RelationRestrictionAxiom)
        )),
        optional(seq('enumerates', field('enumeratedInstances', $.ConceptInstance), repeat(seq(',', field('enumeratedInstances', $.ConceptInstance))))),
        ']'))
    ),

    RelationEntity: $ => seq(
      'relation', 'entity', field('name', $.LocalName), optional(seq(':>', field('ownedSpecializations', $.SpecializationAxiom), repeat(seq(',', field('ownedSpecializations', $.SpecializationAxiom))))), '[',
      'from', field('source', $._Ref),
      'to', field('target', $._Ref),
      optional(field('forwardRelation', $.ForwardRelation)),
      optional(field('reverseRelation', $.ReverseRelation)),
      optional(field('functional', 'functional')),
      optional(seq(field('inverseFunctional', 'inverse'), 'functional')),
      optional(field('symmetric', 'symmetric')),
      optional(field('asymmetric', 'asymmetric')),
      optional(field('reflexive', 'reflexive')),
      optional(field('irreflexive', 'irreflexive')),
      optional(field('transitive', 'transitive')),
      repeat(choice(field('ownedKeys', $.KeyAxiom), field('ownedPropertyRestrictions', $._PropertyRestrictionAxiom), field('ownedRelationRestrictions', $._RelationRestrictionAxiom))),
      ']'
    ),

    ForwardRelation: $ => seq(
      repeat(field('ownedAnnotations', $.Annotation)),
      'forward', field('name', $.LocalName)
    ),

    ReverseRelation: $ => seq(
      repeat(field('ownedAnnotations', $.Annotation)),
      'reverse', field('name', $.LocalName)
    ),

    Structure: $ => seq(
      'structure', field('name', $.LocalName), optional(seq(':>', field('ownedSpecializations', $.SpecializationAxiom), repeat(seq(',', field('ownedSpecializations', $.SpecializationAxiom))))), optional(seq('[',
        repeat(field('ownedPropertyRestrictions', $._PropertyRestrictionAxiom)),
        ']'))
    ),

    _Scalar: $ => choice(
      $.FacetedScalar,
      $.EnumeratedScalar
    ),

    FacetedScalar: $ => seq(
      'scalar', field('name', $.LocalName), optional(seq(':>', field('ownedSpecializations', $.SpecializationAxiom), repeat(seq(',', field('ownedSpecializations', $.SpecializationAxiom))))), optional(seq('[',
        optional(seq('length', field('length', $.UnsignedInteger))),
        optional(seq('minLength', field('minLength', $.UnsignedInteger))),
        optional(seq('maxLength', field('maxLength', $.UnsignedInteger))),
        optional(seq('pattern', field('pattern', $.STRING))),
        optional(seq('language', field('language', $.LocalName))),
        optional(seq('minInclusive', field('minInclusive', $._Literal))),
        optional(seq('minExclusive', field('minExclusive', $._Literal))),
        optional(seq('maxInclusive', field('maxInclusive', $._Literal))),
        optional(seq('maxExclusive', field('maxExclusive', $._Literal))),
        ']'))
    ),

    EnumeratedScalar: $ => seq(
      'enumerated', 'scalar', field('name', $.LocalName), optional(seq(':>', field('ownedSpecializations', $.SpecializationAxiom), repeat(seq(',', field('ownedSpecializations', $.SpecializationAxiom))))), optional(seq('[',
        optional(seq(field('literals', $._Literal), repeat(seq(',', field('literals', $._Literal))))),
        ']'))
    ),

    AnnotationProperty: $ => seq(
      'annotation', 'property', field('name', $.LocalName), optional(seq(':>', field('ownedSpecializations', $.SpecializationAxiom), repeat(seq(',', field('ownedSpecializations', $.SpecializationAxiom)))))
    ),

    ScalarProperty: $ => seq(
      'scalar', 'property', field('name', $.LocalName), optional(seq(':>', field('ownedSpecializations', $.SpecializationAxiom), repeat(seq(',', field('ownedSpecializations', $.SpecializationAxiom))))), optional(seq('[',
        'domain', field('domain', $._Ref),
        'range', field('range', $._Ref),
        optional(field('functional', 'functional')),
        ']'))
    ),

    StructuredProperty: $ => seq(
      'structured', 'property', field('name', $.LocalName), optional(seq(':>', field('ownedSpecializations', $.SpecializationAxiom), repeat(seq(',', field('ownedSpecializations', $.SpecializationAxiom))))), optional(seq('[',
        'domain', field('domain', $._Ref),
        'range', field('range', $._Ref),
        optional(field('functional', 'functional')),
        ']'))
    ),

    Rule: $ => seq(
      'rule', field('name', $.LocalName), '[',
      field('antecedents', $._Predicate), repeat(seq('^', field('antecedents', $._Predicate))), '->', field('consequents', $._Predicate), repeat(seq('^', field('consequents', $._Predicate))),
      ']'
    ),

    _Predicate: $ => choice(
      $._UnaryPredicate,
      $._BinaryPredicate
    ),

    _UnaryPredicate: $ => $.TypePredicate,

    TypePredicate: $ => seq(
      field('type', $._Ref), '(', field('variable', $.LocalName), ')',
    ),

    _BinaryPredicate: $ => choice(
      $.RelationEntityPredicate,
      $.FeaturePredicate,
      $.SameAsPredicate,
      $.DifferentFromPredicate
    ),

    RelationEntityPredicate: $ => seq(
      field('entity', $._Ref), '(', field('variable1', $.LocalName), ',', field('entityVariable', $.LocalName), ',', choice(field('variable2', $.LocalName), field('instance2', $._CrossRef),), ')',
    ),

    FeaturePredicate: $ => seq(
      field('feature', $._Ref), '(', field('variable1', $.LocalName), ',', choice(field('literal2', $._Literal), field('variable2', $.LocalName), field('instance2', $._CrossRef)), ')',
    ),

    SameAsPredicate: $ => seq(
      'sameAs', '(', field('variable1', $.LocalName), ',', choice(field('variable2', $.LocalName), field('instance2', $._CrossRef)), ')'
    ),

    DifferentFromPredicate: $ => seq(
      'differentFrom', '(', field('variable1', $.LocalName), ',', choice(field('variable2', $.LocalName), field('instance2', $._CrossRef)), ')',
    ),

    DescriptionStatement: $ => seq(
      repeat(field('ownedAnnotations', $.Annotation)),
      choice(
        field('DescriptionStatement', $._NamedInstance),
        field('DescriptionStatement', $._NamedInstanceReference)
      )
    ),

    _NamedInstance: $ => choice(
      $.ConceptInstance,
      $.RelationInstance
    ),

    ConceptInstance: $ => seq(
      'ci', field('name', $.LocalName), optional(seq(':', field('ownedTypes', $.ConceptTypeAssertion), repeat(seq(',', field('ownedTypes', $.ConceptTypeAssertion))))), optional(seq('[',
        repeat(choice(field('ownedPropertyValues', $._PropertyValueAssertion), field('ownedLinks', $.LinkAssertion))),
        ']'))
    ),

    RelationInstance: $ => seq(
      'ri', field('name', $.LocalName), optional(seq(':', field('ownedTypes', $.RelationTypeAssertion), repeat(seq(',', field('ownedTypes', $.RelationTypeAssertion))))), optional(seq('[',
        'from', field('sources', $._Ref), repeat(seq(',', field('sources', $._Ref))),
        'to', field('targets', $._Ref), repeat(seq(',', field('targets', $._Ref))),
        repeat(choice(field('ownedPropertyValues', $._PropertyValueAssertion), field('ownedLinks', $.LinkAssertion))),
        ']'))
    ),

    StructureInstance: $ => seq(
      field('type', $._Ref), '[',
      repeat(field('ownedPropertyValues', $._PropertyValueAssertion)),
      ']'
    ),

    _SpecializableTermReference: $ => choice(
      $._ClassifierReference,
      $.FacetedScalarReference,
      $.EnumeratedScalarReference,
      $.AnnotationPropertyReference,
      $.ScalarPropertyReference,
      $.StructuredPropertyReference
    ),

    _ClassifierReference: $ => choice(
      $._EntityReference,
      $.StructureReference
    ),

    _EntityReference: $ => choice(
      $.AspectReference,
      $.ConceptReference,
      $.RelationEntityReference
    ),

    AspectReference: $ => seq(
      'ref', 'aspect', field('aspect', $._Ref), optional(seq(':>', field('ownedSpecializations', $.SpecializationAxiom), repeat(seq(',', field('ownedSpecializations', $.SpecializationAxiom))))), optional(seq('[',
        repeat(choice(field('ownedKeys', $.KeyAxiom), field('ownedPropertyRestrictions', $._PropertyRestrictionAxiom), field('ownedRelationRestrictions', $._RelationRestrictionAxiom))),
        ']'))
    ),

    ConceptReference: $ => seq(
      'ref', 'concept', field('concept', $._Ref), optional(seq(':>', field('ownedSpecializations', $.SpecializationAxiom), repeat(seq(',', field('ownedSpecializations', $.SpecializationAxiom))))), optional(seq('[',
        repeat(choice(field('ownedKeys', $.KeyAxiom), field('ownedPropertyRestrictions', $._PropertyRestrictionAxiom), field('ownedRelationRestrictions', $._RelationRestrictionAxiom))),
        ']'))
    ),

    RelationEntityReference: $ => seq(
      'ref', 'relation', 'entity', field('entity', $._Ref), optional(seq(':>', field('ownedSpecializations', $.SpecializationAxiom), repeat(seq(',', field('ownedSpecializations', $.SpecializationAxiom))))), optional(seq('[',
        repeat(choice(field('ownedKeys', $.KeyAxiom), field('ownedPropertyRestrictions', $._PropertyRestrictionAxiom), field('ownedRelationRestrictions', $._RelationRestrictionAxiom))),
        ']'))
    ),

    StructureReference: $ => seq(
      'ref', 'structure', field('structure', $._Ref), optional(seq(':>', field('ownedSpecializations', $.SpecializationAxiom), repeat(seq(',', field('ownedSpecializations', $.SpecializationAxiom))))), optional(seq('[',
        repeat(field('ownedPropertyRestrictions', $._PropertyRestrictionAxiom)),
        ']'))
    ),

    AnnotationPropertyReference: $ => seq(
      'ref', 'annotation', 'property', field('property', $._Ref), optional(seq(':>', field('ownedSpecializations', $.SpecializationAxiom), repeat(seq(',', field('ownedSpecializations', $.SpecializationAxiom)))))
    ),

    ScalarPropertyReference: $ => seq(
      'ref', 'scalar', 'property', field('property', $._Ref), optional(seq(':>', field('ownedSpecializations', $.SpecializationAxiom), repeat(seq(',', field('ownedSpecializations', $.SpecializationAxiom)))))
    ),

    StructuredPropertyReference: $ => seq(
      'ref', 'structured', 'property', field('property', $._Ref), optional(seq(':>', field('ownedSpecializations', $.SpecializationAxiom), repeat(seq(',', field('ownedSpecializations', $.SpecializationAxiom)))))
    ),

    FacetedScalarReference: $ => seq(
      'ref', 'scalar', field('scalar', $._Ref), optional(seq(':>', field('ownedSpecializations', $.SpecializationAxiom), repeat(seq(',', field('ownedSpecializations', $.SpecializationAxiom)))))
    ),

    EnumeratedScalarReference: $ => seq(
      'ref', 'enumerated', 'scalar', field('scalar', $._Ref), optional(seq(':>', field('ownedSpecializations', $.SpecializationAxiom), repeat(seq(',', field('ownedSpecializations', $.SpecializationAxiom)))))
    ),

    RelationReference: $ => seq(
      'ref', 'relation', field('relation', $._Ref)
    ),

    RuleReference: $ => seq(
      'ref', 'rule', field('rule', $._Ref)
    ),

    _NamedInstanceReference: $ => choice(
      $.ConceptInstanceReference,
      $.RelationInstanceReference
    ),

    ConceptInstanceReference: $ => seq(
      'ref', 'ci', field('instance', $._Ref), optional(seq(':', field('ownedTypes', $.ConceptTypeAssertion), repeat(seq(',', field('ownedTypes', $.ConceptTypeAssertion))))), optional(seq('[',
        repeat(field('ownedPropertyValues', $._PropertyValueAssertion)),
        repeat(field('ownedLinks', $.LinkAssertion)),
        ']'))
    ),

    RelationInstanceReference: $ => seq(
      'ref', 'ri', field('instance', $._Ref), optional(seq(':', field('ownedTypes', $.RelationTypeAssertion), repeat(seq(',', field('ownedTypes', $.RelationTypeAssertion))))), optional(seq('[',
        repeat(field('ownedPropertyValues', $._PropertyValueAssertion)),
        repeat(field('ownedLinks', $.LinkAssertion)),
        ']'))
    ),

    SpecializationAxiom: $ => field('specializedTerm', $._Ref),

    _PropertyRestrictionAxiom: $ => choice(
      $._ScalarPropertyRestrictionAxiom,
      $._StructuredPropertyRestrictionAxiom
    ),

    _ScalarPropertyRestrictionAxiom: $ => choice(
      $.ScalarPropertyRangeRestrictionAxiom,
      $.ScalarPropertyCardinalityRestrictionAxiom,
      $.ScalarPropertyValueRestrictionAxiom
    ),

    ScalarPropertyRangeRestrictionAxiom: $ => seq(
      'restricts', field('kind', $.RangeRestrictionKind), 'scalar', 'property', field('property', $._Ref), 'to', field('range', $._Ref)
    ),

    ScalarPropertyCardinalityRestrictionAxiom: $ => seq(
      'restricts', 'scalar', 'property', field('property', $._Ref), 'to', field('kind', $.CardinalityRestrictionKind), field('cardinality', $.UnsignedInteger), optional(field('range', $._Ref))
    ),

    ScalarPropertyValueRestrictionAxiom: $ => seq(
      'restricts', 'scalar', 'property', field('property', $._Ref), 'to', field('value', $._Literal)
    ),

    _StructuredPropertyRestrictionAxiom: $ => choice(
      $.StructuredPropertyRangeRestrictionAxiom,
      $.StructuredPropertyCardinalityRestrictionAxiom,
      $.StructuredPropertyValueRestrictionAxiom
    ),

    StructuredPropertyRangeRestrictionAxiom: $ => seq(
      'restricts', field('kind', $.RangeRestrictionKind), 'structured', 'property', field('property', $._Ref), 'to', field('range', $._Ref)
    ),

    StructuredPropertyCardinalityRestrictionAxiom: $ => seq(
      'restricts', 'structured', 'property', field('property', $._Ref), 'to', field('kind', $.CardinalityRestrictionKind), field('cardinality', $.UnsignedInteger), optional(field('range', $._Ref))
    ),

    StructuredPropertyValueRestrictionAxiom: $ => seq(
      'restricts', 'structured', 'property', field('property', $._Ref), 'to', field('value', $.StructureInstance)
    ),

    _RelationRestrictionAxiom: $ => choice(
      $.RelationRangeRestrictionAxiom,
      $.RelationCardinalityRestrictionAxiom,
      $.RelationTargetRestrictionAxiom
    ),

    RelationRangeRestrictionAxiom: $ => seq(
      'restricts', field('kind', $.RangeRestrictionKind), 'relation', field('relation', $._Ref), 'to', field('range', $._Ref)
    ),

    RelationCardinalityRestrictionAxiom: $ => seq(
      'restricts', 'relation', field('relation', $._Ref), 'to', field('kind', $.CardinalityRestrictionKind), field('cardinality', $.UnsignedInteger), optional(field('range', $._Ref))
    ),

    RelationTargetRestrictionAxiom: $ => seq(
      'restricts', 'relation', field('relation', $._Ref), 'to', field('target', $._Ref)
    ),

    KeyAxiom: $ => seq(
      'key', field('properties', $._Ref), repeat(seq(',', field('properties', $._Ref)))
    ),

    ConceptTypeAssertion: $ => field('type', $._Ref),

    RelationTypeAssertion: $ => field('type', $._Ref),

    _PropertyValueAssertion: $ => choice(
      $.ScalarPropertyValueAssertion,
      $.StructuredPropertyValueAssertion
    ),

    ScalarPropertyValueAssertion: $ => seq(
      field('property', $._Ref), field('value', $._Literal)
    ),

    StructuredPropertyValueAssertion: $ => seq(
      field('property', $._Ref), field('value', $.StructureInstance)
    ),

    LinkAssertion: $ => seq(
      field('relation', $._Ref), field('target', $._Ref)
    ),

    Annotation: $ => seq(
      '@', field('property', $._Ref), optional(choice(field('value', $._Literal), field('referenceValue', $._Ref)))
    ),

    _Literal: $ => choice(
      $.IntegerLiteral,
      $.DecimalLiteral,
      $.DoubleLiteral,
      $.BooleanLiteral,
      $.QuotedLiteral
    ),

    IntegerLiteral: $ => $.Integer,

    DecimalLiteral: $ => $.Decimal,

    DoubleLiteral: $ => $.Double,

    BooleanLiteral: $ => $.Boolean,

    QuotedLiteral: $ => seq(
      field('value', $.STRING),
      optional(choice(
        seq('^^', field('type', $._Ref)),
        seq('$', field('langTag', $.LocalName))
      ))
    ),

    _Ref: $ => choice(
      $.LocalName,
      $.QualifiedName,
      $.ResourceIdentifier
    ),

    _CrossRef: $ => choice(
      $.QualifiedName,
      $.ResourceIdentifier
    ),

    Namespace: $ => $.NAMESPACE,

    LocalName: $ => $.ID,

    QualifiedName: $ => seq(
      field('prefix', $.LocalName), ':', field('localName', $.LocalName)
    ),

    ResourceIdentifier: $ => $.IRI,

    RangeRestrictionKind: $ => choice('all', 'some'),

    CardinalityRestrictionKind: $ => choice('exactly', 'min', 'max'),

    Boolean: $ => $.BOOLEAN_STR,

    UnsignedInteger: $ => $.UNSIGNED_INTEGER_STR,

    Integer: $ => choice($.UNSIGNED_INTEGER_STR, $.INTEGER_STR),

    Decimal: $ => $.DECIMAL_STR,

    Double: $ => $.DOUBLE_STR,

    BOOLEAN_STR: $ => token(choice('false', 'true')),

    UNSIGNED_INTEGER_STR: $ => token(repeat1(/[0-9]/)),

    INTEGER_STR: $ => token(seq(optional(choice('+', '-')), repeat1(/[0-9]/))),

    DECIMAL_STR: $ => token(
      seq(
        optional(choice('+', '-')),
        choice(
          seq(repeat1(/[0-9]/), optional(seq('.', repeat(/[0-9]/)))),
          seq('.', repeat1(/[0-9]/))
        )
      )
    ),

    DOUBLE_STR: $ => token(
      seq(
        optional(choice('+', '-')),
        choice(
          seq(repeat1(/[0-9]/), optional(seq('.', repeat(/[0-9]/)))),
          seq('.', repeat1(/[0-9]/))
        ),
        optional(seq(
          choice('e', 'E'),
          optional(choice('+', '-')),
          repeat1(/[0-9]/)
        ))
      )
    ),

    STRING: $ => token(choice(
      seq('"', repeat(choice(/[^\\"]/, /\\[^\n]/)), '"'),
      seq('\'', repeat(choice(/[^\\']/, /\\[^\n]/)), '\''),
      seq('"""', repeat(choice(/[^\\"]/, /\\[^\n]/, /"{1,2}[^"]/)), '"""'),
      seq('\'\'\'', repeat(choice(/[^\\']/, /\\[^\n]/, /'{1,2}[^']/)), '\'\'\'')
    )),

    NAMESPACE: $ => token(/<([^>\s#])*(#|\/)>/),

    IRI: $ => token(/<([^>\s#])*>/),

    ID: $ => token(seq(optional('^'), /[a-zA-Z0-9_]/, repeat(/[a-zA-Z0-9_\-.$]/))),

    ML_COMMENT: $ => token(seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/')),

    SL_COMMENT: $ => token(seq('//', /[^\n]*/))

  }

});
