//
//  SwiftAEFormatter.swift
//  AppleEventBridge
//
//  Generates source code representation of SwiftAESpecifier.
//

import Foundation
import AppKit
import AppleEventBridge


/******************************************************************************/
// Formatter abstract base class

// used by a Specifier's description property to render literal representation of itself;
// static glues extend this with application-specific code->name translation tables

class SwiftAEFormatter: AEMQueryVisitor {
    
    var aebAppData: AEBAppData?
    var mutableResult: NSMutableString?
    
    // caution: if sending events to self, processes _must_ useSDEF=true or call this function on a background thread, otherwise SwiftAETranslateAppleEvent will deadlock the main loop when it tries to fetch host app's AETE via ascr/gdte event
    class func formatAppleEvent(event: NSAppleEventDescriptor!, useSDEF: Bool = false) throws -> String {
        return try SwiftAETranslateAppleEvent(event, useSDEF: useSDEF);
    }
    
    // takes an AEMQuery plus AEBStaticAppData instance, and returns the query's literal ObjC representation
    class func formatObject(object: AnyObject!, appData: AEBAppData?) -> String {
        if object is AEMQuery { // instantiate a new formatter instance and pass it to AEMQuery's visitor method
            let renderer = self.init(appData: appData)
            object.resolveWithObject(renderer)
            if let result = renderer.mutableResult {
                return result.copy() as! String
            } else {
                return "\(renderer.app).specifierWithObject(\(object))"
            }
        } else {
            return SwiftAEFormatObject(object)
        }
    }
    
    // clients should avoid calling this constructor directly; use above formatObject(object:appData:) method instead
    required init(appData: AEBAppData?) {
        mutableResult = NSMutableString()
        aebAppData = appData;
    }
    
    func format(object: AnyObject) -> String {
        return object is AEMQuery ? self.dynamicType.formatObject(object, appData: aebAppData) : SwiftAEFormatObject(object) // see above
    }
    
    // stubs; application-specific subclasses should override and extend to provide class name prefix and code->name translations.
    
    var prefix: String {return "AEB"}
    var appClassName: String {return "AEBApplication"}
    var symbolClass: AEBSymbol.Type {return AEBSymbol.self} // workaround: a symbolByCode() method would be more flexible, but triggers a swift bug
    
    func propertyByCode(code: OSType) -> String? { // TO DO: rename propertyNameForCode, elementsNameForCode, symbolForCode for consistency?
        return nil // must return nil if no translation found
    }
    func elementsByCode(code: OSType) -> String? {
        return nil // must return nil if no translation found
    }
    
    // the following methods are called as formatter walks AEMQuery's visitor API
    
    // property and elements specifiers; if no terminology found for given 'want' code, uses raw constructor syntax instead
    
    override func property(code: OSType) -> Self {
        if let name = self.propertyByCode(code) ?? self.elementsByCode(code) {
            mutableResult?.appendFormat(".%@", name)
        } else { // no code->name translation available
            mutableResult?.appendFormat(".propertyWithFourCharCode(\"%@\")", AEMFormatOSType(code)) // TO DO: check this formats correctly for Swift
        }
        return self;
    }
    override func elements(code: OSType) -> Self {
        if let name = self.elementsByCode(code) ?? self.propertyByCode(code) {
            mutableResult?.appendFormat(".%@", name)
        } else { // no code->name translation available
            mutableResult?.appendFormat(".elementsWithFourCharCode(\"%@\")", AEMFormatOSType(code)) // TO DO: check this formats correctly for Swift
        }
        return self;
    }
    
    // by-ordinal selectors
    
    override func first() -> Self {
        self.mutableResult?.appendString("first")
        return self
    }
    override func middle() -> Self {
        self.mutableResult?.appendString("middle")
        return self
    }
    override func last() -> Self {
        self.mutableResult?.appendString("last")
        return self
    }
    override func any() -> Self {
        self.mutableResult?.appendString("any")
        return self
    }
    
    // by-index, by-name, by-id, by-range, by-test selectors
    
    override func byIndex(index: AnyObject!) -> Self {
        self.mutableResult?.appendFormat("[%@]", self.format(index))
        return self
    }
    override func byName(name: AnyObject!) -> Self { // TO DO
        self.mutableResult?.appendFormat("[%@]", self.format(name))
        return self
    }
    override func byID(uid: AnyObject!) -> Self {
        self.mutableResult?.appendFormat(".ID(%@)", self.format(uid))
        return self
    }
    override func byRange(from: AnyObject!, to: AnyObject!) -> Self {
        self.mutableResult?.appendFormat("[%@, %@]", self.format(from), self.format(to))
        return self;
    }
    override func byTest(clause: AnyObject!) -> Self {
        self.mutableResult?.appendFormat("[%@]", self.format(clause))
        return self;
    }
    
    // by-relative-position selectors
    
    override func previous(class_: OSType) -> Self {
        self.mutableResult?.appendFormat(".previous(%@)", self.format(self.symbolClass.aebSymbolForCode(class_)))
        return self;
    }
    override func next(class_: OSType) -> Self {
        self.mutableResult?.appendFormat(".next(%@)", self.format(self.symbolClass.aebSymbolForCode(class_)))
        return self;
    }
    
    // insertion location selectors
    
    override func beginning() -> Self {
        self.mutableResult?.appendString(".beginning")
        return self;
    }
    override func end() -> Self {
        self.mutableResult?.appendString(".end")
        return self;
    }
    override func before() -> Self {
        self.mutableResult?.appendString(".before")
        return self;
    }
    override func after() -> Self {
        self.mutableResult?.appendString(".after")
        return self;
    }
    
    // test clause renderers
    
    override func greaterThan(object: AnyObject!) -> Self {
        self.mutableResult?.appendFormat(" > %@", self.format(object))
        return self;
    }
    override func greaterOrEquals(object: AnyObject!) -> Self {
        self.mutableResult?.appendFormat(" >= %@", self.format(object))
        return self;
    }
    override func equals(object: AnyObject!) -> Self {
        self.mutableResult?.appendFormat(" == %@", self.format(object))
        return self;
    }
    override func notEquals(object: AnyObject!) -> Self {
        self.mutableResult?.appendFormat(" != %@", self.format(object))
        return self;
    }
    override func lessThan(object: AnyObject!) -> Self {
        self.mutableResult?.appendFormat(" < %@", self.format(object))
        return self;
    }
    override func lessOrEquals(object: AnyObject!) -> Self {
        self.mutableResult?.appendFormat(" <= %@", self.format(object))
        return self;
    }
    override func beginsWith(object: AnyObject!) -> Self {
        self.mutableResult?.appendFormat(".beginsWith(%@)", self.format(object))
        return self;
    }
    override func endsWith(object: AnyObject!) -> Self {
        self.mutableResult?.appendFormat(".endsWith(%@)", self.format(object))
        return self;
    }
    override func contains(object: AnyObject!) -> Self {
        self.mutableResult?.appendFormat(".contains(%@)", self.format(object))
        return self;
    }
    override func isIn(object: AnyObject!) -> Self {
        self.mutableResult?.appendFormat(".isIn(%@)", self.format(object))
        return self;
    }
    override func AND(remainingOperands: AnyObject!) -> Self {
        self.mutableResult?.insertString("(", atIndex: 0)
        if remainingOperands is [AnyObject] {
            for operand in remainingOperands as! [AnyObject] {
                self.mutableResult?.appendFormat(" && %@", self.format(operand))
            }
        } else {
            self.mutableResult?.appendFormat(" && %@", self.format(remainingOperands))
        }
        self.mutableResult?.appendString(")")
        return self;
    }
    override func OR(remainingOperands: AnyObject!) -> Self {
        self.mutableResult?.insertString("(", atIndex: 0)
        if remainingOperands is [AnyObject] {
            for operand in remainingOperands as! [AnyObject] {
                self.mutableResult?.appendFormat(" || %@", self.format(operand))
            }
        } else {
            self.mutableResult?.appendFormat(" || %@", self.format(remainingOperands))
        }
        self.mutableResult?.appendString(")")
        return self;
    }
    override func NOT() -> Self {
        self.mutableResult?.insertString("!(", atIndex: 0)
        self.mutableResult?.appendString(")")
        return self;
    }
    
    // specifier roots
    
    override func app() -> Self {
        if aebAppData == nil { // generic specifier
            self.mutableResult?.appendFormat("%@App", self.prefix)
        } else { // concrete specifier
            self.mutableResult?.appendString(self.appClassName)
            do {
                let target = try aebAppData!.target()
                let targetData = target.targetData()
                let targetType = target.targetType()
                if targetType == AEMTargetType.Current {
                    self.mutableResult?.appendString(".currentApplication()")
                } else if targetType == AEMTargetType.FileURL {
                    self.mutableResult?.appendFormat("(name:%@)", self.format((targetData as! NSURL).path!)) // TO DO: check this
                } else if targetType == AEMTargetType.EppcURL {
                    self.mutableResult?.appendFormat("(url:%@)", self.format(targetData))
                } else if targetType == AEMTargetType.ProcessID {
                    self.mutableResult?.appendFormat("(processIdentifier:%@)", self.format(targetData))
                } else { // if targetType == AEMTargetType.Descriptor {
                    self.mutableResult?.appendFormat("(descriptor:%@)", self.format(targetData))
                }
            } catch {
                self.mutableResult?.appendString("(<invalid target (error=\(error))>)")
            }
        }
        return self;
    }
    override func con() -> Self {
        self.mutableResult?.appendFormat("%@Con", self.prefix)
        return self
    }
    override func its() -> Self {
        self.mutableResult?.appendFormat("%@Its", self.prefix)
        return self
    }
    override func customRoot(rootObject: AnyObject!) -> Self {
        self.mutableResult?.appendFormat("%@.customRoot(%@)", self.appClassName, self.format(rootObject))
        return self
    }
}

// utility function used by SwiftAEFormatter class above; may also be called directly if needed (e.g. by support tools)

// get source code representation for a Swift object (number, string, array, dictionary, etc.)
// note: only bridged types are directly supported; other types will show their default representation

func SwiftAEFormatObject(object: AnyObject!) -> String {
    switch object {
    case let obj as [AnyObject]:
        return "[" + (", ".join(obj.map {SwiftAEFormatObject($0)})) + "]"
    case let obj as NSDictionary: // kluge as Swift can't express [AnyHashable:AnyObject]
        return "[" + ", ".join(obj.map({"\(SwiftAEFormatObject($0)): \(SwiftAEFormatObject($1))"})) + "]"
    case let obj as String:
        let tmp = NSMutableString(string: obj)
        for (from, to) in [("\\", "\\\\"), ("\"", "\\\""), ("\r", "\\r"), ("\n", "\\n"), ("\t", "\\t")] {
            tmp.replaceOccurrencesOfString(from, withString: to,
                options: NSStringCompareOptions.LiteralSearch, range: NSMakeRange(0, tmp.length))
        }
        return "\"\(tmp)\""
    case let obj as NSDate:
        return "NSDate(string:\(SwiftAEFormatObject(obj.description)))"
    case let obj as NSURL:
        return "NSURL(string:\(SwiftAEFormatObject(obj.absoluteString)))"
//    case is Bool: // glitchy due to Swift's crappy bridging of ObjC's crappy NSNumber
//        return object as! Bool ? "true" : "false"
    case let obj as NSNumber:
        if CFBooleanGetTypeID() == CFGetTypeID(object) {
            return obj == 0 ? "false" : "true"
        } else {
            return "\(object)"
        }
    default:
        return "\(object)" // SwiftAE objects (specifiers, symbols) are self-formatting; any other Swift object will use its default description (which may or may not be the same as its literal representation, but that's Swift's problem, not ours)
    }
}


